import React from 'react'
import Spinner from './Spinner'
import ProjectCard from './ProjectCard'

import { useQuery } from '@apollo/client'
import { GET_PROJECTS } from '../queries/projectQueries'

const Projects = () => {
    const { loading, error, data } = useQuery(GET_PROJECTS)
    if (loading) return <Spinner></Spinner>
    if (error) return <p>Something went wrong...</p>
    return (
        <>
            {data.projects.length > 0 ? (
                <div className='row'>
                    {data.projects.map(project => (
                        <ProjectCard key={project.id} project={project}></ProjectCard>
                    ))}
                </div>
            ) : (
                <p>No projects</p>
            )}
        </>
    )
}

export default Projects
