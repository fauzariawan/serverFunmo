// saveNumber: async (req, res, next) => { 
//     try { 
//      let user = req.logedInUser 
//      let check = await models.reseller_save.count({ 
//       where: { 
//        s_notujuan: req.body.notujuan 
//       } 
//      }).then(count => { 
//       return (count > 0) ? true : false 
//      }); 
   
//      if (check == true) { 
//       res.send("error") 
//      } else { 
//       let result = await models.reseller_save.create({ 
//        kode_reseller: user.kode_reseller, 
//        s_nama: req.body.nama, 
//        s_notujuan: req.body.notujuan, 
//        s_stype: req.body.tn, 
//        s_createdAt: newDate, 
//        s_updatedAt: newDate 
//       }) 
//       res.status(200).json(result) 
//      } 
//     } catch (error) {} 
//    }

//////////////// SOCKET IO //////////////////////////////////
// module.exports = {
//     async update(req, res) {
//       const { body } = req;
//       const { task_id } = req.params;
  
//       const task = await ProjectTask.findByPk(task_id);
  
//       task.update({
//         name: body.title,
//         description: body.description,
//       });
  
  
//       req.io.emit('update', task); // Here it is the socket.io that brakes the code
//       console.log(task); // this works 
  
//       return res.json(task); // also this
//     },
//   }
//////////// ANSWER NYA ///////////
// req.io.emit('update', task.toJSON()); // will only have table attributes
// req.io.emit('update', JSON.stringify(task)); // 

/////////////////// ngecek setiap 5 detik ///////////////////////
// io.sockets.on('connection', function (socket) {
//     socket.emit('greeting', 'Hello');
//     setInterval(5000,function(data){
//     var uid = data['uid'];
//     var q = "SELECT * FROM messages WHERE user_id="+uid+" ORDER BY id DESC LIMIT 1";
//     connection.query(q, function(err, rows, fields) {
//         if (err) throw err;
//         if (rows[0].id > prev_id){
//           socket.emit('new_message',rows[0]);
//           prev_id = rows[0].id
//         }
//       });
//     });
//   });

// setTimeout(function(){
//     connect.query('select * from your_table', function(err, result) {
//         if(err) { throw new Error('Failed');}
//         initial_result = initial_result || result;
//         if(Changed(initial_result, result)) { socket.emit('changed', result); }
//     });
//     function Changed(pre, now) {
//   // return true if pre != now
//     }
// }, 1000); 