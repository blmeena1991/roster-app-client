import React, { Component } from 'react';
import './Roster.css';
import { Card, Avatar,Icon } from 'antd';
const { Meta } = Card;

class Roster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: "",
        };
    }
    updateLike = (user) => {
        if(!!!this.props.currentUser){
            this.props.history.push("/login");
        }
        this.props.updateLike(user);
    }
    render() {      
        return (
            <div className="poll-content">
                <Card bordered={false}>
                    <Meta avatar={ 
                       <Avatar className="custom-avatar"
                       src={this.props.user.profile.image_url} />
                    }
                    title={<div>
                        <div>
                            {this.props.user.profile.name}
                        </div>
                        <div style={{fontSize: "10px"}}>
                            {this.props.user.profile.title}
                        </div>
                    </div>}
                    description={this.props.user.profile.description}
                />
                    <div style={{paddingLeft: "125px", marginTop: "5px"}}>
                        <div>Want to work with {this.props.user.profile.name}
                        {!!this.props.currentUser && this.props.currentUser.id !== this.props.user.id &&
                             <Icon style={{cursor: "pointer", color: "dodgerblue"}}
                            type="like"
                            theme="outlined"
                            onClick={()=> this.updateLike(this.props.user)}
                            />
                         }
                         {!!!this.props.currentUser &&
                            <Icon style={{cursor: "pointer", color: "dodgerblue"}}
                            type="like"
                            theme="outlined"
                            onClick={()=> this.updateLike(this.props.user)}
                            />
                         }
                        <span style={{color: "dodgerblue"}}>Yes!</span>
                        </div>
                        <div style={{fontSize: "10px",marginTop: "5px"}}> {this.props.user.vote_count} people have send Yes!</div>
                    </div>
                </Card>   
            </div>
        );
    }
}


export default Roster;