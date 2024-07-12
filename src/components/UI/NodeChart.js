import React, { useEffect, useState } from "react";
import Button from "./Button";
import { Tree, TreeNode } from "react-organizational-chart";

const NodeChart = ({ o, parent, setIsDragEnabled }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const CustomTreeNode = (props) => (
    <div style={{ overflowX: "auto" }}>
      <TreeNode {...props} />
    </div>
  );

  function Organization({ org, onCollapse, collapsed }) {
    // const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    let backgroundColor = "#1E2E5A";
    return (
      <Button
        className="w-[80px] h-[80px] rounded-full text-white text-[14px]"
        style={{ backgroundColor: "#1E2E5A" }}
      >
        {org.questionName}
      </Button>
    );
  }
  function Option({ a }) {
    // const classes = useStyles();

    return (
      <Button
        className={`w-[75px] h-[75px] rounded-full border-2 border-[#AEAEAE] text-[10px] ${
          a?.color && `text-white`
        }`}
        style={{ backgroundColor: a?.color }}
      >
        {a.name}
      </Button>
    );
  }

  useEffect(() => {
    o.collapsed = collapsed;
  });

  const T = parent
    ? TreeNode
    : (props) => (
        <Tree
          {...props}
          lineWidth={"2px"}
          lineColor={"#bbc"}
          lineBorderRadius={"12px"}
        >
          {props.children}
        </Tree>
      );

  return (
    <div
      style={{ overflowX: "auto" }}
      onMouseEnter={() => setIsDragEnabled(false)}
      onMouseLeave={() => setIsDragEnabled(true)}
      onTouchStart={() => setIsDragEnabled(false)}
      onTouchEnd={() => setIsDragEnabled(true)}
    >
      {collapsed ? (
        <T label={<Organization org={o} />} />
      ) : (
        <T label={<Organization org={o} />}>
          {o.option &&
            o.option.map((a) => <TreeNode label={<Option a={a} />} />)}
          {/* {o.organizationChildRelationship &&
            o.organizationChildRelationship.map((c) => (
              <NodeChart o={c} parent={o} />
            ))} */}
        </T>
      )}
    </div>
  );
};

export default NodeChart;
