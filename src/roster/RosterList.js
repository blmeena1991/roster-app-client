import React, { Component } from 'react';
import { getAllRosters ,updateUserLike} from '../util/APIUtils';
import Roster from './Roster';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon,notification } from 'antd';
import { ROSTER_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './RosterList.css';

class RosterList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadPollList = this.loadPollList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadPollList(page = 0, size = ROSTER_LIST_SIZE) {
        let promise;
        promise = getAllRosters(page, size);

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise            
        .then(response => {
            const users = this.state.users.slice();
            this.setState({
                users: users.concat(response.content),
                page: response.number,
                size: response.size,
                last: response.last,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                isLoading: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }

    componentDidMount() {
        this.loadPollList();
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                users: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: false,
                isLoading: false
            });    
            this.loadPollList();
        }
    }

    handleLoadMore() {
        this.loadPollList(this.state.page + 1);
    }

    updateLike = (user) => {
        if(!!this.props.currentUser){
            let payload = {
                user_id: this.props.currentUser.id ,
                following_id: user.id
            }
            updateUserLike(payload).then(response => {
                notification.success({
                    message: 'Roster G2',
                    description: `You're successfully like the ${user.profile.name} profile.`,
                  });
                setTimeout(() => {
                this.loadPollList();
                }, 3000);
            }).catch(error => {
                notification.error({
                    message: 'Roster G2',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });    
            });  
           
        }
    }

    render() {
        const userViews = [];
        this.state.users.forEach((user, userIndex) => {
            userViews.push(<Roster 
                currentUser={this.props.currentUser}
                key={userIndex} 
                user={user}
                updateLike={this.updateLike}
                {...this.props}
                />)            
        });

        return (
            <div className="polls-container">
                {userViews}
                {
                    !this.state.isLoading && this.state.users.length === 0 ? (
                        <div className="no-polls-found">
                            <span>No Data Found.</span>
                        </div>    
                    ): null
                }  
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-polls"> 
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }              
                {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
            </div>
        );
    }
}

export default withRouter(RosterList);