const Student = require('../models/student');
const path = require('path');
const  {Parser}  = require('json2csv');
const fs = require('fs');
const Relation = require('../models/relationship')


module.exports.list = async function(req,res){
    try{
        let students= await Student.find({});
        return res.render('student',{
            title:"students List",
            students:students
        })
    }
    catch(err){
        console.log("Error in fetching list of all students", err);
        req.flash('error', "Something went wrong");
        return res.redirect('back');
    }
}




module.exports.create= async function(req,res){

try{
    let student = await Student.findOne({email:req.body.email});


    if(student){
        req.flash('error',"Student already added");
        console.log("Student already exists");
        return res.redirect('back');
    }

    student = await Student.create(req.body);
        student.addedBy =req.user._id;
        student.save();
        req.flash('success', "Student Added!!");
        console.log("Student Added");
        return res.redirect('/students/list');
    

}catch (err) {
    console.log("Error in creating student", err);
    req.flash('error', "Something went wrong");
    return res.redirect('back');
}

}

module.exports.download = async function(req,res){
try{
    let allDetails = await Relation.find({}, 'interview student result').populate('interview', 'name date')
    .populate('student', 'name collegeName placementStatus DSA_score webD_score react_score');
    const fields = [{
        label: 'Student ID',
        value: 'student._id'
    },{
        label: 'Student Name',
        value: 'student.name'
    }, {
        label: 'Student Collage',
        value: 'student.collegeName'
    }, {
        label: 'Student Status',
        value: 'student.placementStatus'
    },{
        label: 'DSA Final Score',
        value: 'student.DSA_score'
    },{
        label: 'WebD Final Score',
        value: 'student.webD_score'
    },{
        label: 'React Final Score',
        value: 'student.react_score'
    },{
        label: 'Interview Date',
        value: 'interview.date'
    },{
        label: 'Interview Company',
        value: 'interview.name'
    },{
        label: 'Interview Student Result',
        value: 'result'
    },
    ];

    // For parsing the file JSON to CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(allDetails);
    
    // creting the file with the data
    fs.writeFileSync(path.join(__dirname, '../public', 'students_data.csv'), csv);

    // for downloading the file
    return res.download(path.join(__dirname, '../public', '/students_data.csv'), function(err){
        if(err){
            console.log("Error in downloding file", err);
            req.flash('error', "Error in downloding file");
            return res.redirect('back');
        }
    });
}
catch(err){
    console.log("Error in downloading students details", err);
    req.flash('error', "Something went wrong");
    return res.redirect('back');
}



}

module.exports.update = async function (req, res) {
    try {

        // created a student array 
        let students = [];
        let results;
        if (typeof req.body.result == "string") {
            results = [req.body.result];
        } else {
            results = req.body.result;
        }

        // push all the student into the array which have same interview id and update the results
        students = await Relation.find({ interview: req.params.id });
        for (let i = 0; i < students.length; i++) {
            students[i].result = results[i];
            students[i].save();
        }
        req.flash('success', "Results Updated!!");
        return res.redirect('back');
    } catch (err) {
        console.log("Error in updating students details", err);
        req.flash('error', "Something went wrong");
        return res.redirect('back');
    }
}