export enum SSE_EVENT_TYPE {
  ALARM_TRIGGER = 'alarmTrigger', // alarm-queue (알람 발생)
  INVENTORY_ALARM_TRIGGER = 'inventoryAlarmTrigger', // crane-cell-queue, (장기 재고 알람)
  REALTIME_EQUIPMENT_VIEW = 'realtimeEquipmentView', // realtime-equipment-view (realtime-equipment-view 실시간 전송)
  CURRENT_EQUIPMENT_OPERATION = 'currentEquipmentOperation', // equipment-operation-queue (장비 동작 실시간 전송)
  CREATE_NOTI_TRIGGER = 'createNotiTrigger', // noti (공지 생성)
  TODO_ALERT = 'todoAlert', // todo (목표량 미달성 알람)
  ALARM_SEND = 'alarmSend', // alarm
  CELL_ALARM_TRIGGER = 'cellAlarmTrigger', // cell-view (재고 알람)
  BROWSER_REFRESH = 'browserRefresh', // system (브라우저 새로고침)
}
