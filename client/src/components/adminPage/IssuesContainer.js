import React from 'react';
import { connect } from 'react-redux';
import { Button, ControlLabel , FormControl,Jumbotron } from 'react-bootstrap';
import IssueItem from './IssueItem'
import {
    createIssue,
    getAllIssues,
    getRoomIssues,
    getRooms,
} from '../../actions/index';

class IssuesContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            roomName: '',
            searchValue: '',
            addFieldIsVisible: false,
        };
    }

    getIssues() {
        if(this.props.roomID) {
            this.props.dispatch(getRoomIssues(this.props.roomID))
        } else {
            this.props.dispatch(getAllIssues());
        }
    }
    componentDidMount() {
        this.props.dispatch(getRooms());
        this.getIssues();
    }
    addIssue(e) {
        let roomID = null;
        if(this.props.roomID) {
            roomID = this.props.roomID
        } else {
            this.props.rooms.forEach((room) => {
                if(room.name === this.state.roomName ) {
                    roomID = room.id;
                }
            });
        }

        const issueData = {
            description: this.state.description,
            active: true,
            roomId: roomID,
        };
        this.props.dispatch(createIssue(issueData));
        this.toggleAddIssueField();
        this.setState({
            searchValue: '',
            roomName: '',
            description: '',
        });
        !this.props.roomID && this.getIssues();
        e.preventDefault();
    };
    toggleAddIssueField() {
        this.setState({
            addFieldIsVisible : !this.state.addFieldIsVisible
        })
    }
    onDescriptionChange(e) {
        this.setState({
            description: e.target.value,
        });
        e.preventDefault();
    };
    onRoomNameChange(e) {
        this.setState({
            roomName: e.target.value,
        });
        e.preventDefault();
    };
    onSearchChange(e) {
        this.setState({
            searchValue: e.target.value,
        });
        e.preventDefault();
    };
    render() {
        let filteredIssues = this.props.issues && this.props.issues.filter((issue) => {
            return issue.description.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                issue.room.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                issue.active.toString().includes(this.state.searchValue)
        });
        return (
            <Jumbotron>
                { this.props.user.currentUser && this.props.user.currentUser.role === 1 ?
                    <div>
                        <h3>All issues</h3>
                        <div  style={{display:  'flex'}}>
                            <FormControl onChange={(e) => this.onSearchChange(e)} value={this.state.searchValue}  type="search" placeholder="Issue search"/>
                            <Button
                                type="button"
                                bsStyle={this.state.addFieldIsVisible? 'warning': 'primary'}
                                onClick={() => {this.toggleAddIssueField()}}>
                                {this.state.addFieldIsVisible ? 'Cancel': 'Add'}
                            </Button>
                        </div>
                        <div>
                            <div style={{display:  'flex', justifyContent: 'space-around'}}>
                                <ControlLabel className="control-label" >Description</ControlLabel>
                                { !this.props.roomID && <ControlLabel className="control-label" >Room name</ControlLabel>}
                                { !this.state.addFieldIsVisible  && <ControlLabel className="control-label" >Status</ControlLabel>}
                            </div>
                            <form onSubmit={(e) => {this.addIssue(e)}} style={!this.state.addFieldIsVisible ? {display: "none"} :{display:"flex"}}>
                                <FormControl className="form-control"   type="text" onChange={(e) => this.onDescriptionChange(e)} value={this.state.description}  required />
                                { !this.props.roomID && <FormControl componentClass="select"  onChange={(e) => this.onRoomNameChange(e)}  value={this.state.roomName} required>
                                    {this.state.roomName === '' && <option  defaultValue/>}
                                    {this.props.rooms.map((room) => {
                                        return <option value={room.name} key={room.id}>{room.name}</option>
                                    })}
                                </FormControl>}
                                <Button type="submit" bsStyle="success" >Save</Button>
                            </form>
                            { filteredIssues && filteredIssues.map( (issue) => {
                                if(issue.room) {
                                    return <IssueItem
                                        description={issue.description}
                                        roomName={issue.room.name}
                                        roomID = {this.props.roomID}
                                        active={issue.active}
                                        key={issue.id}
                                        id={issue.id}
                                    />
                                } else {
                                    return <IssueItem
                                        description={issue.description}
                                        roomName={this.state.roomName}
                                        roomID = {this.props.roomID}
                                        active={issue.active}
                                        key={issue.id}
                                        id={issue.id}
                                    />
                                }

                            }) }
                        </div>
                    </div>
                    : <div>
                        <h3>Your haven't permission to view this page</h3>
                    </div>
                }
            </Jumbotron>
        );
    }
}
function mapStateToProps ({user, rooms}) {
    return {
        user,
        rooms
    }
}

export default connect(mapStateToProps)(IssuesContainer);