const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')



app.use(cors());
PORT = process.env.PORT || 3001;
app.use(express.json())
app.use(express.static(path.join(__dirname, 'build')));
// const db = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'matkhaulagi',
//     database: 'du_lich',
// })


const db = mysql.createPool({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b7b7839688788e',
    password: 'ad0dd4ba',
    database: 'heroku_fc99f196a2c8bee',
})

//register
app.post('/api/register', async (req, res) => {
    const username= req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const activate = 1;
    const checkEmail = await db.query('SELECT email FROM users WHERE email = ?;', [email], async (err, result) => {
        if (err) throw err;
        if (result.length>0) {
            // console.log('User: ' + result[0].email + ' hết')
            res.send({ message: "User existed" })
        }
        else {
            const passwordHash = await bcrypt.hash(password, 10);
            const resultQuery = await db.query("INSERT INTO users (activate,email, password,name) VALUES (?,?,?,?);", [activate,email, passwordHash,username], (err, result) => {
                if (err) throw err;
            })
            jwt.sign({username:username}, process.env.JWT_SECRET,
                { expiresIn: '1d', }, (err, token) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.status(200).json({ token });
                }
            )
        }
    })
})

//login
app.post('/api/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const passwordHash = await db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result, fields) => {
        if (err) {
            res.send(err);
            console.log("AA");
        }
        if (result.length > 0) {
            const isCorrect = await bcrypt.compare(password, result[0].password)
            // console.log('day la result :' + result[0].name + ' hết')
            if (isCorrect) {
                jwt.sign({
                    username: result[0].name
                }, process.env.JWT_SECRET,
                    { expiresIn: '1d', }, (err, token) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.status(200).json({ token });
                    }
                )
                // res.send(result)
            } else {
                // res.sendStatus(401);
                res.send({ message: "Wrong email/password" })
            }
        } 
        else {
            res.send({ message: "Wrong email/password" })
        }
    });
})
//insert 1 tour data
app.get('/api/maintour', (req, res) => {
    const titleTour = "Starcraft";
    const time = "22/08/1990";
    const depart = "10:00 am";
    const minPeople = 12;
    const description = "Bà Đặng Hương Giang, Giám đốc Sở Du lịch Hà Nội cho biết, do ảnh hưởng của đại dịch COVID-19, trong 8 tháng đầu năm 2021 công suất sử dụng phòng khối khách sạn 1 sao đến 5 sao trên địa bàn Thủ đô ước đạt khoảng 22,2% công suất, giảm 7,41% so với cùng kỳ năm 2020. Việc mở rộng mô hình khách sạn cách ly đồng thời đảm bảo mục tiêu kép, vừa hỗ trợ giảm tải cho hệ thống cơ sở cách ly tập trung của Hà Nội, tạo điều kiện thuận lợi cho người dân, vừa tạo cơ hội cho các doanh nghiệp kinh doanh dịch vụ lưu trú điều chỉnh phương thức hoạt động trong tình hình mới và chung tay cùng đẩy lùi dịch bệnh COVID-19."
    const address = "TanSonNhat";
    const fee = 10;
    const dayTrips = "ehe"
    const image = "https://drive.google.com/file/d/1oacdVAjb2c4jLHGwmdHIcQqwPrvq_oQg/view"
    const sqlInsert = "INSERT INTO maintour (title,time,depart,minimum,fee,address,description,dayTrips,image) VALUES (?,?,?,?,?,?,?,?,?);"
    db.query(sqlInsert, [titleTour, time, depart, minPeople, fee, address, description, dayTrips, image], (err, result) => {
        if (err) throw err;
        res.send('Inserted')
    })

})
//get 4 newest tours
app.post('/api/maintour/topData', (req, res) => {
    const sqlInsert = "SELECT * FROM maintour order by id desc LIMIT 4;"
    db.query(sqlInsert, (err, result) => {
        if (err) throw err;
        res.send({ tour: result })
    })

})
//get all tours
app.post('/api/maintour/allData', (req, res) => {
    const sqlInsert = "SELECT * FROM maintour"
    db.query(sqlInsert, (err, result) => {
        if (err) throw err;
        res.send({ tour: result })
    })

})
//get all child tour's image
app.post('/api/childtour/image', (req, res) => {
    const sqlInsert = "SELECT * FROM childtour;"
    db.query(sqlInsert, (err, result) => {
        if (err) throw err;
        res.send({ childTour: result })
    })

})

//get all child tour's day info
app.post('/api/childtour/day', (req, res) => {
    const titleTour = req.body.titleTour;
    const sqlInsert = "SELECT * FROM tourday WHERE titleTour = ? order by id asc;"
    db.query(sqlInsert, [titleTour], (err, result) => {
        if (err) throw err;
        res.send({ day: result })
    })

})
//get 3 newest blog abstract
app.post('/api/bloglist', (req, res) => {
    const sqlInsert = "SELECT * FROM blogs order by idtips desc LIMIT 3;"
    db.query(sqlInsert, (err, result) => {
        if (err) throw err;
        res.send({ bloglist: result })
    })

})

//get each blog info
app.post('/api/blog', (req, res) => {
    const blog = req.body.blog;
    const sqlInsert = "SELECT * FROM blogs WHERE title = ?;"
    db.query(sqlInsert, [blog], (err, result) => {
        if (err) throw err;
        res.send({ blog: result })
    })

})

//get all half day tours 
app.post('/api/maintour/hd', (req, res) => {
    const sqlInsert = "SELECT * FROM maintour WHERE dayTrips = '0.5';"
    db.query(sqlInsert, (err, result) => {
        if (err) throw err;
        res.send({ tourhd: result })
    })

})

//get all 1 day tours 
app.post('/api/maintour/1d', (req, res) => {
    const sqlInsert = "SELECT * FROM maintour WHERE dayTrips = '1';"
    db.query(sqlInsert, (err, result) => {
        if (err) throw err;
        res.send({ tour1d: result })
    })
})
//get all 2 day tours 
app.post('/api/maintour/2d', (req, res) => {
    const sqlInsert = "SELECT * FROM maintour WHERE dayTrips = '2';"
    db.query(sqlInsert, (err, result) => {
        if (err) throw err;
        res.send({ tour2d: result })
    })
})

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`run on port ${PORT}`)
});