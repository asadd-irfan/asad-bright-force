const cron = require("node-cron");
const Positions = require('../company/models/positions');
const PositionCandidate = require('../admin/models/position-candidates');
const talentFiltration = require('../talent-filtration/talent-filtration-script')
const amqp = require('amqplib/callback_api');


exports.processedTalentsForPosition = async () => {
  // cron.schedule("*/10 * * * * *", () => {
  cron.schedule("5 0 * * *", () => {
    findPositionsForTodayProcessedTalents()
  });

}

exports.dispatchedTalentsForPosition = async () => {
  // cron.schedule("*/10 * * * * *", () => {
  cron.schedule("5 1 * * *", () => {
    findPositionsForTodayDispatchedTalents()
  });

}

const findPositionsForTodayProcessedTalents = async () => {

  let todayDate = new Date()
  let newDate = new Date(new Date().setDate(new Date().getDate() + 1))

  let positions = await Positions.find({
    sentToAccountManager: true, isDeleted: false,
    status: 'Open',
    lastGroupStatus: 'un-processed',
    nextDispatchedDate: { $lte: newDate }
  });

  console.log("finding Positions For Today Processed Talents under cron at ", todayDate);
  let totalPositions = positions.length;
  console.log("total positions", totalPositions)

  if (totalPositions > 0) {
    positions.forEach(async (position, key) => {

      amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function (error1, channel) {
          if (error1) {
            throw error1;
          }
          let queue = 'filter_and_processed_talents_for_position';
          channel.assertQueue(queue, {
            durable: true
          });

          let positionId = position._id.toString();
          // console.log("positionId",positionId)

          channel.sendToQueue(queue, Buffer.from(positionId), {
            persistent: true
          });
          console.log(" [x] Sent '%s'", positionId);
        });
        setTimeout(function () {
          connection.close();
          // process.exit(0);
        }, 500);

      });

    });


  } else {
    console.log("No Positions Found for processing talents on date ", todayDate)
  }

}


const findPositionsForTodayDispatchedTalents = async () => {
  let todayDate = new Date()
  let newDate = new Date(new Date().setDate(new Date().getDate() - 1))

  let positions = await Positions.find({
    sentToAccountManager: true, isDeleted: false,
    status: 'Open',
    lastGroupStatus: 'processed',
    lastProcessedDate: { $lte: newDate }
  })
  console.log("findPositionsForTodayDispatchedTalents under cron at ", todayDate);

  let totalPositions = positions.length;
  console.log("total positions", totalPositions)

  if (totalPositions > 0) {
    for (let i = 0; i < totalPositions; i++) {

      let processedCandidates = await PositionCandidate.find(
        { "position": positions[i]._id, "status": 'processed' }
      );
      // console.log('processedCandidates',processedCandidates.length)
      let processedTalents = [];

      if (processedCandidates.length > 0) {
        processedCandidates.map(el => {
          let obj = {
            id: el.candidateId._id,
            score: el.matchingScore
          }
          processedTalents.push(obj)
        });
        // console.log('in cronjob processedTalents', processedTalents)
        let response = await talentFiltration.dispatchTalentsForPosition(processedTalents, positions[i]._id);
        console.log("Final Response for positionID '" + positions[i]._id + "' is : ", response)
        // res.status(200).json(response)

      }

    }

  } else {
    console.log("No Positions Found for dispatch talents on date ", todayDate)
  }
}

