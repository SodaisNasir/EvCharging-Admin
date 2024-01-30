import { cloneDeep } from "lodash";
import { useState } from "react";

export const transformBack = (data) => {
  const result = {};

  data.forEach((node) => {
    const key = node.label;
    const value = node.checked;
    const children = node.childrenNodes;

    if (children.length > 0) {
      result[key] = transformBack(children);
    } else {
      result[key] = value;
    }
  });

  return result;
};

export const transform = (data, parent) => {
  return Object.keys(data).map((key) => {
    const value = data[key];
    const node = {
      label: key,
      checked: false,
      childrenNodes: [],
      parent: parent,
    };

    if (typeof value === "boolean") {
      node.checked = value;
    } else {
      const children = transform(value, node);
      node.childrenNodes = children;
      if (children.every((node) => node.checked)) {
        node.checked = true;
      }
    }

    return node;
  });
};

const updateAncestors = (node) => {
  if (!node.parent) {
    return;
  }

  const parent = node.parent;
  if (parent.checked && !node.checked) {
    parent.checked = false;
    updateAncestors(parent);
    return;
  }

  if (!parent.checked && node.checked) {
    if (parent.childrenNodes.every((node) => node.checked)) {
      parent.checked = true;
      updateAncestors(parent);
      return;
    }
  }

  return;
};

const toggleDescendants = (node) => {
  const checked = node.checked;

  node.childrenNodes.forEach((node) => {
    node.checked = checked;
    toggleDescendants(node);
  });
};

const findNode = (nodes, label, ancestors) => {
  let node = undefined;
  if (ancestors.length === 0) {
    return nodes.filter((node) => node.label === label)[0];
  }

  for (let ancestor of ancestors) {
    const candidates = node ? node.childrenNodes : nodes;
    node = candidates.filter((node) => node.label === ancestor)[0];
  }
  return node?.childrenNodes.filter((node) => node.label === label)[0];
};

const NestedCheckbox = ({
  data,
  selectedChecks,
  setSelectedChecks,
  type = "create",
}) => {
  const initialNodes =
    type === "create" ? transform(data) : transform(selectedChecks);
  const [nodes, setNodes] = useState(initialNodes);
  // navigator.clipboard.writeText(nodes);

  const handleBoxChecked = (e, ancestors) => {
    const checked = e.currentTarget.checked;
    const node = findNode(nodes, e.currentTarget.value, ancestors);

    node.checked = checked;
    toggleDescendants(node);
    updateAncestors(node);

    const clone = cloneDeep(nodes);
    setNodes(clone);
    setSelectedChecks(clone);
  };

  return (
    <NestedCheckboxHelper
      nodes={nodes}
      ancestors={[]}
      onBoxChecked={handleBoxChecked}
    />
  );
};

const NestedCheckboxHelper = ({
  nodes,
  ancestors,
  onBoxChecked,
  nestedStyles,
}) => {
  const prefix = ancestors.join(".");
  const styles = `pl-[${ancestors.length * 2.5}px]`;
  return (
    <ul>
      {nodes.map(({ label, checked, childrenNodes }) => {
        const id = `${prefix}.${label}`;
        let children = null;
        if (childrenNodes.length > 0) {
          children = (
            <NestedCheckboxHelper
              nodes={childrenNodes}
              ancestors={[...ancestors, label]}
              onBoxChecked={onBoxChecked}
              // nestedStyles={!checked && ancestors.length !== 0 ? "hidden" : ""}
            />
          );
        }

        return (
          <li key={id}>
            <div
              className={`flex items-center py-0.5 ${nestedStyles ?? ""}`}
              style={{ paddingLeft: ancestors.length * 15 }}
            >
              <input
                type="checkbox"
                name={id}
                id={id}
                value={label}
                checked={checked}
                onChange={(e) => onBoxChecked(e, ancestors)}
                className="w-[14px] h-[14px] cursor-pointer"
              />
              <label htmlFor={id} className="pl-1.5 text-xs cursor-pointer capitalize">
                {label === "faqs" ? "FAQs" : label.replace(/_/g, " ")}
              </label>
            </div>
            {children}
          </li>
        );
      })}
    </ul>
  );
};

export default NestedCheckbox;
