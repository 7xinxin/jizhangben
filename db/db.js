// success:数据库连接成功的回调
// error:数据库连接失败的回调
module.exports=function(success,error){
    //判断error为其设置默认值（即调用db函数时，也可以不用传错误的参数）
    if(typeof error !== 'function'){
        error=()=>{
            console.log('连接失败...')
        }
    }

    //导入mongoose
    const mongoose=require('mongoose');

    //导入配置文件
    const {DBHOST,DBPORT,DBNAME}=require('../config/config.js');

    //关闭mongoose警告
    mongoose.set('strictQuery',true);

    //连接mongodb服务
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

    //设置回调
    //设置连接成功的回调；  官方推荐once事件，回调函数只会执行一次，on会自动重连
    mongoose.connection.once('open',()=>{
        success();
    })

    //设置连接错误的回调
    mongoose.connection.on('open',()=>{
        error();
    })

    //关闭数据库连接（项目运行过程中，不会添加该代码）
    mongoose.connection.on('close',()=>{
        console.log('连接关闭');
    })
}