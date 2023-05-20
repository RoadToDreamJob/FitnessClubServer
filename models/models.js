const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userEmail: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    userPassword: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userRole: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'USER'
    }
})

const Trainer = sequelize.define('trainer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    trainerFio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trainerAge: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    trainerSex: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trainerImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trainerPhone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    trainerExperience: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

const Achievement = sequelize.define('achievement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    achievementDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

const TimeTable = sequelize.define('time_table', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    trainingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
})

const Time = sequelize.define('time', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    value: {
        type: DataTypes.TIME,
        allowNull: false
    }
})

const Training = sequelize.define('training', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    trainingName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    trainingDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    trainingImage: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

const ClientTraining = sequelize.define('client_training', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

const ClientAbonement = sequelize.define('client_abonement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    remainingCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

const ClientAbonementStatus = sequelize.define('client_abonement_status', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    statusName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
})

const AbonementTrainings = sequelize.define('abonement_trainings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

const Abonement = sequelize.define('abonement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    trainingCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    abonementTitle: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    abonementDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    abonementPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
})

const Client = sequelize.define('client', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clientFio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clientPhone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    clientSex: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clientBirthday: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    clientImage: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

const News = sequelize.define('news', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    newsTitle: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    newsDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    newsImage: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

User.hasOne(Trainer, {onDelete: 'CASCADE'})
Trainer.belongsTo(User)

User.hasOne(Client, {onDelete: 'CASCADE'})
Client.belongsTo(User)

Trainer.hasMany(Achievement, {onDelete: 'CASCADE'})
Achievement.belongsTo(Trainer)

Trainer.hasMany(TimeTable, {onDelete: 'CASCADE'})
TimeTable.belongsTo(Trainer)

Time.hasMany(TimeTable, {onDelete: 'CASCADE'})
TimeTable.belongsTo(Time)

Training.hasMany(TimeTable, {onDelete: 'CASCADE'})
TimeTable.belongsTo(Training)

ClientAbonement.belongsToMany(TimeTable, {through: ClientTraining})
TimeTable.belongsToMany(ClientAbonement, {through: ClientTraining})

Abonement.belongsToMany(Training, { through: AbonementTrainings, as: 'Training', foreignKey: 'abonementId' });
Training.belongsToMany(Abonement, { through: AbonementTrainings, as: 'Abonement', foreignKey: 'trainingId' });

ClientAbonementStatus.hasMany(ClientAbonement, {onDelete: 'CASCADE'})
ClientAbonement.belongsTo(ClientAbonementStatus)

Abonement.hasMany(ClientAbonement, {onDelete: 'CASCADE'})
ClientAbonement.belongsTo(Abonement)

Client.hasMany(ClientAbonement, {onDelete: 'CASCADE'})
ClientAbonement.belongsTo(Client)

module.exports = {
    User,
    Trainer,
    Achievement,
    TimeTable,
    Time,
    Training,
    ClientTraining,
    ClientAbonement,
    ClientAbonementStatus,
    AbonementTrainings,
    Abonement,
    Client,
    News
}
