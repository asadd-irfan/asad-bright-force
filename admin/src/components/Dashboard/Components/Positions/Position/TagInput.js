import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { OrderedListOutlined } from '@ant-design/icons';
import {
  Typography,
  Row,
  Col,
  Input,
  Tag,
} from "antd";

const { Paragraph } = Typography;
const { CheckableTag } = Tag;

function TagInput(props) {

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      props.inputValues,
      result.source.index,
      result.destination.index
    );
    props.setFunction(items);
  };
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const grid = 1;
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    // styles we need to apply on draggables
    ...draggableStyle
  });

  const getListStyle = isDraggingOver => ({
    padding: grid,
    width: 250
  });
  return (
    <Row>
          <Col xs={24} sm={24} md={16} lg={16}>
            <div className="choose-role-wrapper">
            <h6>{props.title}</h6>
              <Paragraph>Up to three features</Paragraph>
            </div>
        
            {props.tags ?
              props.tags.map((tag, index) => {
                return (
                  <CheckableTag
                      key={index}
                      className="checkable-tag checkable-tag-margin"
                      value={tag.name}
                      checked={props.selectedTags.includes(tag._id) ? true : false}
                      onChange={checked =>
                        props.parentHandleTagChange(checked, tag._id, tag.name, props.tagParentKey, props.isDisabled)
                      }
                    >
                      {tag.name}
                    </CheckableTag>
                );
              }) : <h4>Loading...</h4>}
          </Col>
          <Col xs={24} sm={24} md={8} lg={8}>
            <div className="choose-role-wrapper">
              <h6>{props.inputTitle}</h6>

        
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {props.inputValues.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={props.isDisabled}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Row>
                            <Col xs={4} sm={4} md={4} lg={4}>
                          <OrderedListOutlined />
                          <span className="pl-1 pt-1 m-1">
                             {index+1}</span>
                            
                            </Col>
                            <Col xs={20} sm={20} md={20} lg={20}>
                          <Input  value={item.tagName} style={{color:'black'}}/>
                            
                            </Col>
                          </Row>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
               
            </div>
          </Col>

        </Row>
        
  );
}

export default (TagInput);
