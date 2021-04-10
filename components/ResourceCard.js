import { Grid, Typography, Button, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { useState } from "react";

/**
* Component class that represents a resource card
*/
const useStyles = makeStyles((theme) => {
return {
card: {
minWidth: " 150px",
minHeight: "150px",
padding: "10px",
},
};
});

export default function ResourceCard({ resources, attrs, onDelete }) {
const classes = useStyles();
const [isShown, setIsShown] = useState(false);

/**
* Prepares data for a resource card
* simply displays each attribute with appropriate value
*/
const cardData = Object.keys(resources).map((key) => {
const attribute_name = attrs[key];
return (
<Typography key={key}>
{attribute_name}: {String(resources[key])}
</Typography>
);
});

function toggleInfo() {
if (isShown) {
setIsShown(false);
} else {
setIsShown(true);
}
}

function MoreInfo(props) {
if (isShown) {
return (
<div>Testing</div>
);
} else {
return (
<div></div>
);
}
}

return (
<Card className={classes.card} onClick={() => toggleInfo()}>
{cardData}{" "}
<MoreInfo></MoreInfo>
{onDelete ? (
<DeleteIcon onClick={() => onDelete(resources.organizationName)} />
) : (
""
)}
</Card>
);
}