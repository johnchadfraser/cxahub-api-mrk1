//Establish express server, cron, and others.
const CronJob = require('node-cron')
const axios = require('axios')

async function getEvent(url, route, time) {

    await axios.get(url + '/' + route, {
        params: {
            order_by: 'e_date ASC',
            e_date_gte: this.dateNow, 
            status_id: 1
        }
    })

    .then(res => {

        console.log('CronJob: Set Event Cache ' + time + ' - Status Code:', res.statusText);
        
    })
    
    .catch(error => {

        console.log('No event data was found: ' + error);

    })

}

async function getContent(url, route, time) {

    await axios.get(url + '/' + route, {
        params: {
            status_id: 1
        }
    })

    .then(res => {

        console.log('CronJob: Set Content Cache ' + time + ' - Status Code:', res.statusText);
    
    })
    
    .catch(error => {

        console.log('No content data was found: ' + error);
    
    })

}

exports.initScheduledJobs = () => {

    const setCache = CronJob.schedule("*/20 * * * *", async () => {

        const d = new Date();
        let time = d.toLocaleTimeString();

        //Cache Events
        getEvent(process.env.API_URL, 'event', time);

        //Cache Content
        getContent(process.env.API_URL, 'content', time);

    });
  
    setCache.start();
    
}