// Users first select a type of activity, then input a brief description
// Then they start the timer
// Implemented by Fengyu

import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import "./activitySelector.css"

const db = openDatabase('TimeTracker', '1.0', 'main database', 1024 * 1024 * 1024);

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function ActivitySelector(props) {
    const classes = useStyles();
    const description = props.description;
    const tag = props.tag;
    const setDescription = props.setDescription;
    const setTag = props.setTag;
    const [tagList, setTagList] = useState([]);

    useEffect(() => {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM ACTIVITIES', [], function (tx, results) {
                const len = results.rows.length;
                for (let i = len - 1; i >= 0; i--) {
                    setTagList(oldRows => [...oldRows, results.rows.item(i).name])
                }
            }, null);
        });
    }, []);

    const handleTextChange = (event) => {
        setDescription(event.target.value);
    };

    const handleSelectChange = (event) => {
        setTag(event.target.value);
    };

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <TextField
                id="standard-multiline-flexible"
                label="Description"
                multiline
                maxRows={4}
                value={description}
                onChange={handleTextChange}
            />
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Tag</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={tag}
                    onChange={handleSelectChange}
                >
                    {tagList.map((value) => {
                        return (<MenuItem value={value}>{value}</MenuItem>)
                    })}
                </Select>
            </FormControl>
        </form>
    );
}
