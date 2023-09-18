import React, { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { ADD_CLIENT } from '../mutations/clientMutation';
import { GET_CLIENTS } from '../queries/clientQueries';
import { useMutation } from '@apollo/client';

const AddClientModal = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [addClient] = useMutation(ADD_CLIENT, {
        variables: { name, email, phone },
        update(cache, { data: { addClient } }) {
            const { clients } = cache.readQuery({ query: GET_CLIENTS });
            cache.writeQuery({
                query: GET_CLIENTS,
                //data:{clients:client.concat([addClient])}
                data: { clients: { ...clients, addClient } }
            })
        }
    })

    const onSubmit = (e) => {
        e.preventDefault();
        if (name === "" || email === '' || phone === '') {
            return alert('please fill in all fields')
        }
        addClient(name, email, phone);
    };


    return (
        <div >

            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addClientModal" >
                <div className='d-flex align-item-center'>
                    <FaUser className='icon'></FaUser>
                    <div>Add Client</div>
                </div>
            </button>


            <div className="modal fade" id="addClientModal" aria-labelledby="addClientModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addClientModalLabel">Add Client</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={onSubmit}>
                                <div className='mb-3'>
                                    <label className='form-label'>Name</label>
                                    <input type='text' className='form-control' id='name' value={name} onChange={(e) => setName(e.target.value)}></input>
                                </div>
                                <div className='mb-3'>
                                    <label className='form-label'>Email</label>
                                    <input type='email' className='form-control' id='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                                </div>
                                <div className='mb-3'>
                                    <label className='form-label'>Phone</label>
                                    <input type='phone' className='form-control' id='phone' value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                                </div>
                                <button type='submit' data-bs-dismiss='modal' className='btn btn-secondary'>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddClientModal
