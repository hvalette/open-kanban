

const ProjectCard = ({project}: any) => {
    return (
      <button className="p-4 shadow-md rounded">
        <span className="text-lg font-semibold">{project.name}</span>
      </button>
    )
}

export default ProjectCard
