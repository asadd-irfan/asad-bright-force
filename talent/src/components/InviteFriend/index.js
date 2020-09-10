import React from "react";
import { Button } from 'antd';


function InviteFriend() {

  return (
    <div style={{
        textAlign: 'center',
        margin: '25px'
    }}>
      <h3 style={{
        margin: '45px'
    }}>Invite your friends and earn up to 7,500$</h3>
      <p>
        Introduce your friends to BrightForce. Let us use real-time data to uncover new paths and opportunities for your friends.
      </p>
      <p>
        Your friends will double their earning with both a step forward in their careers and $500 for each accepted offer with BrightForce.
      </p>
      <Button style={{
        margin: '45px'
    }}>
        Invite friends
      </Button>
    </div>
  );
}

export default InviteFriend;
