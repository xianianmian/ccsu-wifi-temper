import mqtt from 'mqtt'
let options = {
  // clientId: 'ccsu_ruoyi_admin',
  // username: "xxx",
  // password: "xxxx",
  // cleanSession: false,
  keepAlive: 60,
  connectTimeout: 4000
}
// 172.16.40.182
// 云服务器地址： www.ccsuly.top
const mqttCon = mqtt.connect('ws://172.17.30.184:8083/mqtt', options)
mqttCon.on("connect", (e) => {
  console.log("mqtt服务器连接成功", e);
  //订阅名为 "--"的主题
  mqttCon.subscribe(["temp_getdata"], { qos: 1 }, (err) => {
    if (!err) {
      console.log('订阅成功');
      //向主题叫“pubtop”发布一则内容为'hello,this is a nice day!'的消息（告诉服务器订阅成功
      // this.publish("pubtop", 'hello,this is a nice day!')
    } else {
      console.log('消息订阅失败');
    }
  }); //订阅主题为test的消息
});
export default mqttCon;
