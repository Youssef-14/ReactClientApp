import React, {Component} from "react";
import axios from "axios";
/*import {Stack} from "@mui/material";
import Pagination from '@mui/material/Pagination';*/

export class VerifDemande extends Component {

    filterElement = React.createRef();
    state = {
        data: [],
        data_length: 0,
        showPopup: false,
        showPopup2: false,
        demande: null,
        types: ['all'],
        status:['all','accepté','refusé','encours','àcorriger'],
        filter_type:'all',
        filter_status:'all',
        pagination: {
            page: 1,
            limit: 5,
            pages : 1
        }
    }
    // Method to open the pop-up
    openPopUp = (demande) => {
        this.setState({ showPopup: true });
        this.setState({ demande: demande });
    }
    // Method to close the pop-up
    closePopUp = () => {
        this.setState({ showPopup: false });
    }

    // Lifecycle method
    componentDidMount() {
        this.getDateLength();
    }

    handlePaginationNumberChange(e,page) {
        this.setState({pagination:{limit:this.state.pagination.limit,page,pages: this.state.pagination.pages}}, () => {
            this.getDateLength();
        });
    }

    handlePaginationChange(e) {
        this.setState({pagination:{limit:e.target.value,page:1,pages: Math.ceil( this.state.data_length/e.target.value)}}, () => {
            this.getDateLength();
        });
    }

    handleFilterStatusChange(e) {
        this.setState({ filter_status: e.target.value }, () => {
            this.setState({ pagination: {page: 1,limit: this.state.pagination.limit,pages :this.state.pagination.pages  } })
            this.getDateLength();
        });
    }
    handleFilterTypeChange(e) {
        this.setState({ filter_type: e.target.value }, () => {
            this.setState({ pagination: {page: 1,limit: this.state.pagination.limit,pages :this.state.pagination.pages  } })
            this.getDateLength();
        });
    }

    getDateLength = () => {
        axios
            .get("https://localhost:7095/get-demandes-filtered-number/"+this.state.filter_type+"/"+this.state.filter_status)
            .then(response => {
                this.setState({ data_length: response.data })
                console.log(this.state.data_length);
                this.fetchData();
            })
            .catch(error => {
                console.error(error);
            });
    }

    fetchData = () => {
        const min = (this.state.pagination.page - 1) * this.state.pagination.limit;
        const max = this.state.pagination.limit;
        console.log(max+" "+min);
        axios
            .get("https://localhost:7095/get-filtered-demands/"+this.state.filter_type+"/"+this.state.filter_status+"/"+min+"/"+max)
            .then(response => {
                const data = response.data;
                this.state.data=data;
                console.log(this.state.data)
                this.setState({ pagination: {page: this.state.pagination.page,limit: this.state.pagination.limit,pages :Math.ceil(this.state.data_length/this.state.pagination.limit)   } })
                data.forEach((demande) => {
                    if(!this.state.types.includes(demande.type)){
                        this.state.types.push(demande.type);
                    }
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    updateDemand = (event,value) => {
        event.preventDefault();
        axios
            .put('https://localhost:7095/set-demande-to-'+value,this.state.demande)
            .then(response => {
                if(this.state.pagination.page > 1){
                    this.setState({ pagination: {page: this.state.pagination.page-1,limit: this.state.pagination.limit,pages :this.state.pagination.pages  } })
                    this.setState({ pagination: {page: this.state.pagination.page,limit: this.state.pagination.limit,pages :this.state.pagination.pages-1  } })
                }
                this.fetchData();
                this.closePopUp();
            })
            .catch(error => {
                console.error(error);
            });
    }
    paginationNumberRender(){
        let paginationNumbers = [];
        for(let i = 1; i <= this.state.pagination.pages; i++){
            paginationNumbers.push(i);
        }
        return(
            paginationNumbers.map(page => (
                <td key={page} className={'pa'} value={page} onClick={e =>this.handlePaginationNumberChange(e,page) }>
                    <button>{page}</button>
                </td>
            ))
        );
    }

    demanadsrender() {
        return (
            <tbody>

            {
                this.state.data.map(demande =>
                    <tr key={demande.id}>
                        <td>{demande.type}</td>
                        <td>{demande.date}</td>
                        <td>{demande.comment}</td>
                        <td>{demande.status}</td>
                        <td><button className="btn text-white bg-dark" onClick={() =>this.openPopUp(demande)}>option</button></td>
                    </tr>
                ) }
            </tbody>);
    }

    // option pop-up render
    optionsrender(){
        return (
            <div className="popup">
                <div className="popup-content">
                    <button className="btn text-white bg-dark justify-content-center" onClick={this.closePopUp}>Close</button>
                    <form className={'form2'}>
                        <div className="form-group">
                            <label htmlFor="name">Type</label>
                            <input type="text" className="form-control" id="name" value={this.state.demande.type} placeholder="Enter name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Date</label>
                            <input type="text" className="form-control" id="email" value={this.state.demande.date} placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Commentaire</label>
                            <input type="text" className="form-control" id="email" value={this.state.demande.comment} placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">status</label>
                            <input type="text" className="form-control" id="email" defaultValue={this.state.demande.status} placeholder="Enter email" />
                        </div>
                        <hr/>
                        <button  className="btn text-white bg-dark btn-primary" onClick={(event) => this.updateDemand(event,"accepted")}>Accepter</button>
                        <button  className="btn text-white bg-dark btn-primary" onClick={(event) => this.updateDemand(event,"refused")}>Refuser</button>
                        <button  className="btn text-white bg-dark btn-primary" onClick={(event) => this.updateDemand(event,"be-corrected")}>à corriger</button>
                    </form>
                </div>
            </div>
        );
    }
    render() {
        const { data } = this.state;

        return (
            <div className={'main'}>
                <div>
                    <h1>Filter</h1>
                    Type de demande : <select id={'filter'} ref={this.filterElement} onChange={e => this.handleFilterTypeChange(e)}>
                    {this.state.types.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                    </select><br/>
                    Status : <select id={'filter'} ref={this.filterElement} onChange={e => this.handleFilterStatusChange(e)}>
                    {this.state.status.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                </div>
                {data ? (<div>
                        <table className='table table-striped' aria-labelledby="tabelLabel">
                            <thead>
                            <tr>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Comment</th>
                                <th>Status</th>
                                <th>options</th>
                            </tr>
                            </thead>
                            {
                                this.demanadsrender()
                            }
                        </table>
                        <table className='table table-striped' aria-labelledby="tabelLabel">
                            <tbody>
                            <tr>
                                <td width={'10px'}>
                                    <select id={'pagination'} defaultValue={5} onChange={e => this.handlePaginationChange(e)}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                    </select>
                                </td>
                                <td align={'center'}>
                                    <table>
                                        <tbody>

                                        <tr>
                                            {
                                                this.paginationNumberRender()
                                            }
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <br/><br/>
                        {this.state.showPopup && (this.optionsrender())}
                    </div>
                ) : (
                    <div>Loading data...</div>
                )}
            </div>
        );
    }
}