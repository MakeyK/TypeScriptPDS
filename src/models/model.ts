import { DataTypes, Model, Optional } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

const sequelize = new Sequelize({
    dialect: 'postgres',
    database: 'database_name',
    username: 'username',
    password: 'password',
});

class Users extends Model {
    public id_user!: string;
    public login!: string;
    public password!: string;
    public role!: string;
}

Users.init({
    id_user: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    login: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING }
}, { sequelize, modelName: 'users', timestamps: false });

class Stations extends Model {
    public id_station!: string;
    public name_station!: string;
    public location!: string;
}

Stations.init({
    id_station: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name_station: { type: DataTypes.TEXT },
    location: { type: DataTypes.STRING, unique: true }
}, { sequelize, modelName: 'stations', timestamps: false });

class Trains extends Model {
    public id_train!: string;
    public number_train!: string;
    public type_train!: string;
}

Trains.init({
    id_train: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    number_train: { type: DataTypes.TEXT },
    type_train: { type: DataTypes.TEXT }
}, { sequelize, modelName: 'trains', timestamps: false });

class Passengers extends Model {
    public id_user!: string;
    public id_passenger!: string;
    public first_name!: string;
    public last_name!: string;
}

Passengers.init({
    id_user: { type: DataTypes.UUID, references: { model: Users, key: 'id_user' } },
    id_passenger: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    first_name: { type: DataTypes.TEXT },
    last_name: { type: DataTypes.TEXT }
}, { sequelize, modelName: 'passengers', timestamps: false });

class Van extends Model {
    public id_train!: string;
    public id_van!: string;
    public type!: string;
    public capacity!: number;
}

Van.init({
    id_train: { type: DataTypes.UUID, references: { model: Trains, key: 'id_train' } },
    id_van: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    type: { type: DataTypes.TEXT },
    capacity: { type: DataTypes.INTEGER }
}, { sequelize, modelName: 'vans', timestamps: false });

class Tickets extends Model {
    public id_passenger!: string;
    public number_van!: string; // Это должно быть UUID
    public id_ticket!: string;
    public place!: string;
    public category!: string;
}

Tickets.init({
    id_passenger: { type: DataTypes.UUID, references: { model: Passengers, key: 'id_passenger' } },
    number_van: { type: DataTypes.UUID, references: { model: Van, key: 'id_van' } }, // Исправлено на UUID
    id_ticket: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    place: { type: DataTypes.STRING },
    category: { type: DataTypes.TEXT }
}, { sequelize, modelName: 'tickets', timestamps: false });

class Schedules extends Model {
    public id_train!: string;
    public id_station!: string;
    public id_schedule!: string;
    public way!: number;
    public arrival_time!: Date;
    public departure_time!: Date;
}

Schedules.init({
    id_train: { type: DataTypes.UUID, references: { model: Trains, key: 'id_train' } },    id_station: { type: DataTypes.UUID, references: { model: Stations, key: 'id_station' } },
    id_schedule: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    way: { type: DataTypes.INTEGER },
    arrival_time: { type: DataTypes.DATE },
    departure_time: { type: DataTypes.DATE }
}, { sequelize, modelName: 'schedules', timestamps: false });

// Определение связей
Users.hasMany(Passengers, {
    foreignKey: 'id_user',
});

Passengers.belongsTo(Users, {
    foreignKey: 'id_user',
});

Trains.hasMany(Van, {
    foreignKey: 'id_train',
});

Van.belongsTo(Trains, {
    foreignKey: 'id_train',
});

Van.hasMany(Tickets, {
    foreignKey: 'number_van',
});

Tickets.belongsTo(Van, {
    foreignKey: 'number_van',
});

Stations.hasMany(Schedules, {
    foreignKey: 'id_station',
});

Schedules.belongsTo(Stations, {
    foreignKey: 'id_station',
});

Trains.hasMany(Schedules, {
    foreignKey: 'id_train',
});

Schedules.belongsTo(Trains, {
    foreignKey: 'id_train',
});

Passengers.hasMany(Tickets, {
    foreignKey: 'id_passenger',
});

Tickets.belongsTo(Passengers, {
    foreignKey: 'id_passenger',
});

export {
    Users,
    Passengers,
    Tickets,
    Trains,
    Schedules,
    Van,
    Stations
};