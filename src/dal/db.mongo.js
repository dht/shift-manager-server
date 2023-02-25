const { default: mongoose, Schema } = require('mongoose');

const connect = () => {
    return new Promise((resolve, reject) => {
        mongoose.set('strictQuery', true);
        mongoose.connect('mongodb://localhost:27017/main', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = mongoose.connection;

        db.on('error', function () {
            console.log('connection error');
            reject();
        });

        db.once('open', function () {
            console.log('we are connected!');
            resolve();
        });
    });
};

const User = mongoose.model('User', {
    id: Number,
    fullName: String,
    numOfActions: Number,
});

const Employee = mongoose.model('Employee', {
    firstName: String,
    lastName: String,
    startYear: Number,
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
});

const Department = mongoose.model('Department', {
    name: String,
    manager: { type: Schema.Types.ObjectId, ref: 'Employee' },
});

const Shift = mongoose.model('Shift', {
    date: Date,
    startingHour: Number,
    endingHour: Number,
});

const users = {
    create: (data) => {
        const newItem = new User(data);
        return newItem.save();
    },
    read: () => {
        return User.find();
    },
    update: (id, change) => {
        return User.findByIdAndUpdate(id, change);
    },
    delete: (id) => {
        return User.findByIdAndDelete(id);
    },
    createMany: (data) => {
        return User.insertMany(data);
    },
    readById: (id) => {
        return User.findOne({ id });
    },
    deleteMany: () => {
        return User.deleteMany();
    },
};

const employees = {
    create: (data) => {
        const newItem = new Employee(data);
        return newItem.save();
    },
    read: () => {
        return Employee.find();
    },
    update: (id, change) => {
        return Employee.findByIdAndUpdate(id, change);
    },
    delete: (id) => {
        return Employee.findByIdAndDelete(id);
    },
    createMany: (data) => {
        return Employee.insertMany(data);
    },
};

const departments = {
    create: (data) => {
        const newItem = new Department(data);
        return newItem.save();
    },
    read: () => {
        return Department.find();
    },
    update: (id, change) => {
        return Department.findByIdAndUpdate(id, change);
    },
    delete: (id) => {
        return Department.findByIdAndDelete(id);
    },
    createMany: (data) => {
        return Department.insertMany(data);
    },
};

const shifts = {
    create: (data) => {
        const newItem = new Shift(data);
        return newItem.save();
    },
    read: () => {
        return Shift.find();
    },
    update: (id, change) => {
        return Shift.findByIdAndUpdate(id, change);
    },
    delete: (id) => {
        return Shift.findByIdAndDelete(id);
    },
    createMany: (data) => {
        return Shift.insertMany(data);
    },
};

module.exports = {
    connect,
    users,
    employees,
    departments,
    shifts,
    User,
    Employee,
    Department,
    Shift,
};
