import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeMode, getRoomsByCurrentUser, getRooms } from '../../actions';
import {NotificationManager} from 'react-notifications';
import ToggleButton from 'react-toggle-button';
import "react-select/dist/react-select.css";
import "react-virtualized/styles.css";
import "react-virtualized-select/styles.css";


const borderRadiusStyle = { borderRadius: 0 };
class SearchUser extends React.Component {
    state = {
        isClicked: false
    };

    handleSelect = (isClicked) => {
        if(isClicked) {
            this.props.dispatch(changeMode("PM_SEARCH"));
            this.props.dispatch(getRoomsByCurrentUser(this.props.user.currentUser.id));
            this.createNotification('search')();
        } else {
            this.props.dispatch(changeMode());
            this.props.dispatch(getRooms());
            this.createNotification('cancel')();
            this.setState({
                selectedOption: ''
            });
        }
    };

    createNotification = (type) => {
        return () => {
            switch (type) {
                case 'search':
                    NotificationManager.success('My invitations mode is ON', 'Events', 3000);
                    break;
                case 'cancel':
                    NotificationManager.success('My invitations mode is OFF', 'Events', 3000);
                    break;
            }
        };
    };

    render() {
        return (
            <div>
                {this.props.user.currentUser.role === 2 ?
                    <div className="pm-search">
                        <p className="invitations">My invitations:</p>
                        <ToggleButton
                            value={ this.state.isClicked}
                            thumbStyle={borderRadiusStyle}
                            trackStyle={borderRadiusStyle}
                            onToggle={(value) => {
                                this.setState({
                                    isClicked: !value,
                                });
                                this.handleSelect(!value)
                            }}
                        />
                    </div>: null}
            </div>
        );
    }
}

SearchUser.propTypes = {
    users: PropTypes.object,
};

const mapStateToProps = ({ user }) => ({
    user,
    role: user.currentUser && user.currentUser.role
});

export default connect(mapStateToProps)(SearchUser);