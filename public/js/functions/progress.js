import Swal from "sweetalert2";

export const updateProgress = () => {
  const tasks = document.querySelectorAll("li.tarea");
  if (tasks.length) {
    const completedTasks = document.querySelectorAll("i.completo");
    const progress = Math.round((completedTasks.length / tasks.length) * 100);
    const progressBar = document.querySelector("#percentage");
    progressBar.style.width = progress + "%";

    if (progress === 100) {
      Swal.fire(
        "Project Complete",
        "Congratulations, you've finished your project",
        "success"
      );
    }
  }
};
