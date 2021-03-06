
import React from 'react';
import MomentUtils from '@date-io/moment';
import { Paper, Icon, Grid, Link, Divider, Popover, Badge, Button, TextField, FormControl, InputLabel, MenuItem, Select, FormControlLabel, Switch } from '@material-ui/core'
import {
    DateTimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const SearchBar = ({ name, steamId, lastSeenFrom, lastSeenUntil, blacklistedOnly, pageSize, setPageSize,
    setName, setSteamId, setLastSeenFrom, setLastSeenUntil, setBlacklistedOnly, onSearch }) => (
        <Grid container spacing={2} alignContent="center" alignItems="center" justify="center">
            <Grid item>
                <TextField
                    label="Search by Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </Grid>
            <Grid item>
                <TextField
                    label="Search by Steam ID"
                    value={steamId}
                    onChange={e => setSteamId(e.target.value)}
                />
            </Grid>
            <Grid item>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DateTimePicker label="Last seen from" value={lastSeenFrom} 
                    onChange={setLastSeenFrom} format="YYYY/MM/DD HH:mm" />
                </MuiPickersUtilsProvider>
            </Grid>
            <Grid item>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DateTimePicker label="Last seen until" value={lastSeenUntil} 
                    onChange={setLastSeenUntil} format="YYYY/MM/DD HH:mm" />
                </MuiPickersUtilsProvider>
            </Grid>
            <Grid item>
                <FormControlLabel
                    value={blacklistedOnly}
                    onChange={e => setBlacklistedOnly(e.target.checked)}
                    control={<Switch color="primary" />}
                    label="Blacklisted only"
                    labelPlacement="top"
                />
            </Grid>
            <Grid item xs={4} xl={1}>
                <FormControl fullWidth>
                    <InputLabel >Page size</InputLabel>
                    <Select
                        value={pageSize}
                        onChange={e => setPageSize(e.target.value)}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                        <MenuItem value={40}>40</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                        <MenuItem value={200}>200</MenuItem>
                        <MenuItem value={500}>500</MenuItem>
                        <MenuItem value={1000}>1000</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item><Button variant="contained" color="primary" size="large" onClick={onSearch}>Load results</Button></Grid>
        </Grid>
    )


export default SearchBar;