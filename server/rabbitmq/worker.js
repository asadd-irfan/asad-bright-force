const amqp = require('amqplib/callback_api');
const talentFiltration = require('../talent-filtration/talent-filtration-script')


const rabbitMqWorker = async () => {

  amqp.connect('amqp://localhost', function (error, connection) {

    connection.createChannel(function (error, channel) {
      let queue = 'filter_and_processed_talents_for_position';

      channel.assertQueue(queue, {
        durable: true
      });
      channel.prefetch(1);
      console.log(" [*] Waiting for messages in queue: %s. ", queue);
      channel.consume(queue, async function (msg) {
        // console.log('consuming ',msg.content.toString());
        let filterTalents = [];
        filterTalents = await talentFiltration.filterTalentsForPositions(msg.content.toString());

        let response;
        if (filterTalents.length > 0) {
          response = await talentFiltration.processedTalentsForPosition(filterTalents, msg.content.toString());
          console.log("Final Response: ", response)
          // res.status(200).json(response)

        } else {
          let obj = {
            message: "No Filtered Candidates Found for this position.",
          };
          console.log(obj)
          // res.status(200).json(obj)
        }
        console.log(" [x] Done %s", msg.content.toString());
        // setTimeout(function () {
        channel.ack(msg);
        // }, 4000);

      }, {
        noAck: false
      });
    });
  });

}

module.exports = { rabbitMqWorker };
