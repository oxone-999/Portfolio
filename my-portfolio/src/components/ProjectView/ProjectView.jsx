import "./projectView.css";

function ProjectView() {
  return (
    <div className="btn-conteiner">
      <a
        className="btn-content"
        onClick={() => {
          window.location.href = "/projects";
        }}
      >
        <span className="btn-title">projects</span>
        <div className="underline"></div>
      </a>
    </div>
  );
}

export default ProjectView;
