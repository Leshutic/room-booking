import React from 'react';
import { connect } from 'react-redux';
import { Button} from 'react-bootstrap';

import Lightbox from 'react-image-lightbox';
import {
    deleteRoomImage
} from '../../actions/index';

class ImageItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            roomName: '',
            searchValue: '',
            addFieldIsVisible: false,
            photoIndex: this.props.index,
            isLightboxOpen: false,
            isMouseEnter: false
        };
    }
    render() {
        let {photoIndex, isLightboxOpen, isMouseEnter} = this.state;
        let imagesUrl = this.props.images.map((image) => {
            return image.url
        });
        return (
            <div  style={{display: "inline-block", marginRight: "20px", marginBottom: "20px"}}>
                { isMouseEnter &&
                <Button
                    bsStyle="danger"
                    style={{position:"absolute", marginLeft: '164px' }}
                    onMouseEnter={() => this.setState({isMouseEnter: true})}
                    onMouseLeave={() => this.setState({isMouseEnter: false})}
                    onClick={() => {this.props.dispatch(deleteRoomImage(this.props.id))}}>X
                </Button>
                }
                <img
                    onClick={()=>{this.setState({isLightboxOpen: true})}}
                    onMouseEnter={() => this.setState({isMouseEnter: true})}
                    onMouseLeave={() => this.setState({isMouseEnter: false})}
                    style={{width:"200px", height: "200px"}}
                    src={this.props.url}
                    alt="office pic"
                />
                {isLightboxOpen &&
                <Lightbox
                    mainSrc={imagesUrl[photoIndex]}
                    nextSrc={imagesUrl[(photoIndex + 1) % imagesUrl.length]}
                    prevSrc={imagesUrl[(photoIndex + imagesUrl.length - 1) % imagesUrl.length]}
                    onCloseRequest={() => this.setState({ isLightboxOpen: false })}
                    onMovePrevRequest={() => this.setState({photoIndex: (photoIndex + imagesUrl.length - 1) % imagesUrl.length})}
                    onMoveNextRequest={() => this.setState({photoIndex: (photoIndex + 1) % imagesUrl.length})}
                />
                }
                </div>
        );
    }
}
function mapStateToProps ({images }) {
    return {
        images
    }
}

export default connect(mapStateToProps)(ImageItem);