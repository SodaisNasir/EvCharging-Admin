import React, { useState } from "react";
import { VscClose } from "react-icons/vsc";
import Button from "../Buttons/Button";
import toast from "react-hot-toast";
import { token } from "../../utils/url";
import { parseJson } from "../../utils";
import NestedCheckbox, { transformBack } from "../NestedCheckBox";

const PermissionsModal = ({
  url,
  permissionsModal,
  setPermissionsModal,
  successCallback,
  gridCols = 2,
}) => {
  const id = permissionsModal.data._id;
  const initialPermissions = parseJson(permissionsModal.data._permissions);

  const [role, setRole] = useState(permissionsModal.data.role);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      const formdata = new FormData();
      const permission = Array.isArray(permissions)
        ? transformBack(permissions)
        : permissions;

      formdata.append("_id", id);
      formdata.append("role_id", role);
      formdata.append("permissions", JSON.stringify(permission));

      console.log("_id", id);
      console.log("role_id", role);
      console.log("permissions", JSON.stringify(permission));

      const requestOptions = {
        headers,
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const res = await fetch(url, requestOptions);
      const json = await res.json();

      console.log("json", json);

      if (json.status) {
        successCallback && successCallback(json, {_id: id, role, _permissions: permission});
        close();
      }
    } catch (error) {
      toast.error("Unable to update!", { duration: 2000 });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setPermissionsModal({ ...permissionsModal, isOpen: false });
  };

  const styles = {
    modal: {
      base: "fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity",
      open: permissionsModal.isOpen
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none",
    },
    content: `bg-white rounded-md w-full mx-5 ${
      gridCols === 2 ? "max-w-xl" : "max-w-sm"
    }`,
    header: "flex justify-between items-center py-3 px-4 border-b",
    main: {
      base: "p-4 overflow-y-auto max-h-[70vh]",
      grid: `grid grid-cols-${gridCols} gap-4`,
      get() {
        return `${this.base} ${this.grid}`;
      },
    },
    footer: "flex justify-end py-3 px-4 border-t",
    closeButton:
      "text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-base p-1.5 ml-auto inline-flex items-center",
    input:
      "w-full shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500/50 focus:border-blue-600 block p-2.5",
    createButton: `!w-full !rounded-md ${loading ? "!py-2" : "!py-3"}`,
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return (
    <div
      className={`${styles.modal.base} ${styles.modal.open}`}
      onClick={handleBackdropClick}
    >
      <form onSubmit={handleSubmit} className={styles.content}>
        <div className={styles.header}>
          <h2 className="text-lg font-semibold">Permissions</h2>
          <button type="button" onClick={close} className={styles.closeButton}>
            <VscClose />
          </button>
        </div>
        <div className={styles.main.get()}>
          <div className="col-span-2">
            <label
              htmlFor="role"
              className="block mb-2 text-xs font-medium text-gray-900"
            >
              Role
            </label>
            <input
              name="role"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              required
            />
          </div>
          <NestedCheckbox
            selectedChecks={initialPermissions}
            setSelectedChecks={setPermissions}
            type="edit"
          />
        </div>
        <div className={styles.footer}>
          <Button
            type="submit"
            title="Update"
            isLoading={loading}
            extraStyles={styles.createButton}
          />
        </div>
      </form>
    </div>
  );
};

export default PermissionsModal;
