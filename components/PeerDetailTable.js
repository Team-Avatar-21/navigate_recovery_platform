import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

/**
* Component class that represents a resource card
*/
const useStyles = makeStyles((theme) => {
    return {
        peerRow: {
            fontFamily: "sans-serif",
            backgroundColor: "white",
            border: "solid 1px gray",
            margin: "5px 15px",
            width: "100%",
            cursor: "pointer",
            fontSize: "16px",
        },
        title: {
            padding: "10px",
        },
        details: {
            padding: "10px",
        },
        label: {
            fontWeight: "400",
            fontSize: "14px",
        },
        value: {
            color: "rgb(65, 65, 65)",
            fontSize: "14px",
        }
    };
});

export default function PeerDetailTable({peer}) {
    const classes = useStyles();
    const [isDetailShown, setIsDetailShown] = useState(false);

    const togglePeerRow = () => {
        if (isDetailShown) {
            setIsDetailShown(false);
        } else {
            setIsDetailShown(true);
        }
    };

    let details;
    if (isDetailShown) {
        details = (
            <table className={classes.details}>
                <tr>
                    <td className={classes.label}>First Name</td>
                    <td className={classes.value}>{peer.first_name}</td>
                </tr>
                <tr>
                    <td className={classes.label}>Last Name</td>
                    <td className={classes.value}>{peer.last_name}</td>
                </tr>
                <tr>
                    <td className={classes.label}>Nickname</td>
                    <td className={classes.value}>{peer.nick_name}</td>
                </tr>
                <tr>
                    <td className={classes.label}>Number</td>
                    <td className={classes.value}>{peer.peer_number}</td>
                </tr>
                <tr>
                    <td className={classes.label}>Email</td>
                    <td className={classes.value}>{peer.peer_email}</td>
                </tr>
                <tr>
                    <td className={classes.label}>Emergency Contact Name</td>
                    <td className={classes.value}>{peer.emergency_name}</td>
                </tr>
                <tr>
                    <td className={classes.label}>Emergency Contact Number</td>
                    <td className={classes.value}>{peer.emergency_number}</td>
                </tr>
                <tr>
                    <td className={classes.label} >Notes</td>
                    <td className={classes.value}>{peer.notes}</td>
                </tr>
                <tr>
                    <td className={classes.label} >Resource</td>
                    <td className={classes.value}>{peer.resource_id}</td>
                </tr>
            </table>
        );
    }

    return (
        <div className={classes.peerRow} onClick={togglePeerRow}>
            <div className={classes.title}>{peer.first_name + " " + peer.last_name}</div>
            {details}
        </div>
    );
}