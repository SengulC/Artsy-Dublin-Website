// this is the controller for event related stuff
// TODO: const userId = req.session?.userId

const model = require("../models/events");
const postsModel = require("../models/posts");

// these also have to be async functions because we need to await the return from mysql!
// which in turn awaits the call from the api (model side)

async function get (req, res) {
    // fetch all events from the db!! what's already stored in there!!
    const results = await model.get();
    res.json(results);
}

async function updateByType (req, res) {
    const eventType = req.params.type;
    // update events, do an API call to populate the db!
    let results;
    if (eventType == 'tmdbFilm')
        results = await model.fetchFilmsAndPopulate();
    else
        results = await model.fetchLiveEventsAndPopulate(eventType);
    // then call all events from the db
    // const results = await model.get();
    res.json(results);
}

async function getEventById (req, res) {
    const eventDetail = await model.getEventById(req.params.eventid);
    if(!eventDetail) return res.status(404).send('Event not found');

    const userId = 1; // TODO: const userId = req.session?.userId
    const attendance = userId
        ? await postsModel.getAttendanceStatus(userId, req.params.eventid)
        : null;

    res.json({ ...eventDetail, attendance }); // attendance: null if not logged in / not attended, otherwise { eventAttendId, rating }
}

async function getEventRepeatsById (req, res) {
    const eventDetail = await model.getEventRepeatsById(req.params.eventid);
    if(eventDetail[1][0].length<=0) return res.status(404).send('Event does not repeat');
    
    res.json(eventDetail);
}

module.exports = {
    get,
    updateByType,
    getEventById,
    getEventRepeatsById
};