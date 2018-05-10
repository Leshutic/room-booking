import React from 'react';
import { connect } from 'react-redux';
import LoginSection from './LoginSection';
import SearchManager from './SearchManager';
import SearchUser from './SearchUser';
import {deleteCurrentUser, getManagers} from "../../actions";
import { Link } from 'react-router-dom';


class NavBar extends React.Component {

    componentWillMount(){
        this.props.dispatch(getManagers());
    }

    render() {
        let {managers, currentUser, isLoaded} = this.props.user || null;
        let {role, location} = this.props;
        return (
            <div>
                {this.props.user.isLoaded ? <div className="reactHeader">
                {role <= 2 ? <div>
                    {location.pathname.includes("/adminPanel") ?
                        <Link className="link_search_to_btn" to="/room" >Home</Link>
                        :
                        currentUser  && <SearchManager user={currentUser} /> }
                        </div> : null}
                        {currentUser && <LoginSection user={currentUser} logout={() => this.props.dispatch(deleteCurrentUser())}/>}
                        </div>
                    :
                    null}
             </div>
        );
    }
}


const mapStateToProps = ({ user }) => ({
    user,
    role: user.currentUser && user.currentUser.role
});

export default connect(mapStateToProps)(NavBar);
