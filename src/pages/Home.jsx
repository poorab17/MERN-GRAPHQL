import React from 'react'
import AddClientModal from "../components/AddClientModal"
import Projects from '../components/Projects'
import Client from '../components/Client'
import AddProjectModal from '../components/AddProjectModal'
const Home = () => {
    return (
        <>
            <div className='d-flex gap-3 mb-4'>
                <AddClientModal></AddClientModal>
                <AddProjectModal></AddProjectModal>
            </div>
            <Projects></Projects>
            <Client></Client>
        </>
    )
}

export default Home
