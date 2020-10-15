import Swal from "sweetalert2";
import axios from "axios";

const btnDelete = document.querySelector("#delete-project");

if (btnDelete) {
  btnDelete.addEventListener("click", (e) => {
    const urlProject = e.target.dataset.projectUrl;
    Swal.fire({
      title: "Do you want to remove this project?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `${location.origin}/projects/${urlProject}`;
        axios
          .delete(url, { params: { urlProject } })
          .then((response) => {
            console.log(response);
            Swal.fire("Deleted!", "Your project has been deleted.", "success");

            // setTimeout(() => {
            //   window.location.href = "/";
            // }, 3000);
          })
          .catch(() => {
            Swal.fire({
              title: "Error",
              text: "Not able to delete project",
            });
          });
      }
    });
  });
}

export default btnDelete;
