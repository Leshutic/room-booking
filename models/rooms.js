// MODEL ROOMS
module.exports = function(sequelize, DataTypes) {
    let Rooms = sequelize.define('rooms', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
          type: DataTypes.STRING,
            allowNull: false
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true
        }
    },{
        timestamps: false
    });

    return Rooms;
};