const express=require("express");
const router=express.Router();


const alarmcontroller=require("../controllers/alarmcontroller");
router.get('/:email',alarmcontroller.alarms_user);
router.post('/:email',alarmcontroller.alarms_post);
router.get('/delete/:alarmid',alarmcontroller.alarms_delete);
router.post('/update/:alarmid',alarmcontroller.alarms_update);
router.get('/get/:alarmid',alarmcontroller.alarms_id);
router.get('/update_alarm/:alarmid',alarmcontroller.alarms_update_ejs);
router.get('/set/add_new_alarm/:email',alarmcontroller.alarms_newalarm);

module.exports=router;
