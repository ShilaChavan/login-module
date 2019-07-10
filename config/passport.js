var LocalStrategy = require("passport-local").strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dconfig = ('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE'+dbconfig.database);

module.export = function(passport){
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });
    passport.deserialiZeUser(function(user,done){
        connection.query("SELECT * FROM users where id = ?" ,[id],
        function(err,rows){
            done(err,rows[0])
        });
    });

    passport.use(
        'local.signup',
        new LocalStrategy ({
            usernameField : 'username',
            passwordField : 'password',
            passReqCallBack : true 
        },
        function(req,username,passport,done){
            connection.query("SELECT * FROM users WHERE username =?" ,
            [username],function(ree, rows){
                if(err)
                    return done(err);
                    if(rows.length){
                        return(null,false,req.flash('signupMessge','already have an account'))
                       }
                       else{
                           var newUsermysql={
                               username : username,
                               password : bcrypt.hashSync(password,null,null) 
                           };
                           var inserQuery = "INSERT INTO users (username,password)values(?,?)";

                           connection.query(insertQuery,[newUsermysql.username,newUsermysql.password],
                            function(err,rows){
                                newUsermysql.id = rows.insertId;
                                return done(null,newUsermysql);
                            });
                       }
                });
            })
    );
            passport.use(
                'local-login',
            new LocalStrategy({
                usernameField : 'username',
                passwordField  : 'password',
                passReqCallBack:true
            },
            function(req,username,password,done){
                connection.query("SELECT * FROM users WHERE username= ?",[username],
                function(err,rows){
                    if(err)
                    return done(err);
                    if(!rows.length){
                        return done(null,false,req.flash('LoginMessage','No User Found'));
                    }
                    if(!bcrypt.compareSync(password, rows[0].password))
                    return done(null,false,req.flash('loignMessage', 'Wrong Password'));
                    return done(null, rows[0]);
                });
            })
        );
};
