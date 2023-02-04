import React, {Component} from "react";
import axios from "axios";

export class MyDemands extends Component {
    state = {
        data: [],
        showPopup: false,
        showPopup2: false,
        demande: null,
        types: [],
        filter: 'all',
        pagination: {
            page: 1,
            limit: 5,
            pages : 1
        }
    }
    componentDidMount() {
        this.fetchData();
    }

    // Method to open the pop-up
    openPopUp = () => {
        this.setState({ showPopup: true });
    }
    // Method to close the pop-up
    closePopUp = () => {
        this.setState({ showPopup: false });
    }

    // Method to open the pop-up
    openPopUp2 = () => {
        this.setState({ showPopup2: true });
    }
    // Method to close the pop-up
    closePopUp2 = () => {
        this.setState({ showPopup2: false });
    }
    handlefile = (event) => {
        this.setState({file: event.target.files[0]});
    }
    fetchData = () => {
        axios
            .get('https://localhost:7095/get-all-demandes-by-user/1')
            .then(response => {
                const data = response.data;
                this.setState({ data });

                this.setState({ pagination: {page: this.state.pagination.page,limit: this.state.pagination.limit,pages :Math.ceil(data.length/this.state.pagination.limit)   } });
                data.forEach((employe) => {
                    if(!this.state.types.includes(employe.type)){
                        this.state.types.push(employe.type);
                    }
                });

            })
            .catch(error => {
                console.error(error);
            });
    }
    //Ajouter une demande
    addDemand = (event) => {
        event.preventDefault();

        const {form} = event.target
        const type = form.elements.type.value;
        const comment = form.elements.comment.value;

        let file = this.state.file;
        const formData = new FormData();
        formData.append('file', file);
        axios({
            method: 'post',
            url: 'https://localhost:7095/uploads/you',
            data: formData,
            headers: {'Content-Type': 'multipart/form-data' },
        })
            .then(function (response) {
                console.log(response);
            }
        );


        const mois = new Date().getMonth()+1;
        const month = mois<10 ?"0"+mois:mois;
        const jour = new Date().getDate();
        const day = jour<10 ?"0"+jour:jour;
        const date = new Date().getFullYear()+"-"+month+"-"+ day +"T"+new Date().toLocaleTimeString();
        console.log(date);
        axios({
            method: 'post',
            url: 'https://localhost:7095/create-demande',
                data: {
                UserId: 1,
                type: type,
                date: date,
                comment : comment,
            },
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        }).then(() => {
            this.fetchData();
            this.closePopUp();
        })
            .catch(error => {
                    console.error(error);
                }
            );
    }
    //Supprimer un demande
    deleteDemand = (id) =>{
        axios
            .delete('https://localhost:7095/delete-demande-by-id/' + id)
            .then(() => {
                this.fetchData();
            })
            .catch(error => {
                    console.error(error);
                }
            );
    }
    // create the pop-up render
    createrender() {
        return (
            <div className="popup">
                <div className="popup-content">
                    <form className={'form'}>
                        <div className="form-group">
                            <label htmlFor="name">Type de Demande</label>
                            <input type="text" className="form-control" name={'type'} id="name" placeholder="Donner le type de demande" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Commentaires</label>
                            <input type="text" className="form-control" name={'comment'} id="email" placeholder="Donner un commentaire" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="File">Ajouter ici les pdf</label>
                            <input type="file" multiple className={'form-control'} id="customFile" onChange={(e)=>this.handlefile(e)} />
                        </div>
                        <button type="submit" className="btn text-white bg-dark btn-primary" onClick={this.addDemand}>Submit</button>
                    </form>
                    <button className="btn text-white bg-dark justify-content-center" onClick={this.closePopUp}>Close</button>
                </div>
            </div>
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
                        <td><button className="btn text-white bg-dark" onClick={() =>this.openPopUp2()}>option</button></td>
                        <td><button className="btn text-white bg-dark" onClick={() =>this.deleteDemand(demande.id)}>Annuler</button></td>
                    </tr>
                ) }
            </tbody>);
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

    render() {
        const { data } = this.state;

        return (
            <div className={'main'}>
                <div>
                    <h1>Filter</h1>
                    Department : <select id={'filter'} ref={this.filterElement} onChange={e => this.setState({filter:e.target.value})}>
                    <option value="all">ALL</option>
                    {this.state.types.map(option => (
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
                                <th>Annulation</th>
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
                                    <select id={'pagination'} defaultValue={5} onChange={e => this.setState({pagination:{limit:e.target.value,page:1,pages: Math.ceil( data.length/e.target.value)}})}>
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
                        <button className="btn text-white bg-dark justify-content-right" onClick={this.openPopUp}>Add</button>
                        {this.state.showPopup && (this.createrender())}
                    </div>
                ) : (
                    <div>Loading data...</div>
                )}
            </div>
        );
    }
}