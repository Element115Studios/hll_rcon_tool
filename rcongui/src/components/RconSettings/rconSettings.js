import React from 'react'
import {
    Grid, Typography, Button, TextField
} from "@material-ui/core"
import { range } from "lodash/util"
import { showResponse, postData } from '../../utils/fetchUtils'
import { toast } from "react-toastify"
import _ from 'lodash'
import LinearProgress from "@material-ui/core/LinearProgress"
import Padlock from '../../components/SettingsView/padlock'
import WarningIcon from '@material-ui/icons/Warning';

class RconSettings extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            messages: [],
            randomized: false,
            enabled: false
        }

        this.loadBroadcastsSettings = this.loadBroadcastsSettings.bind(this)
        this.validate_messages = this.validate_messages.bind(this)
        this.save_messages = this.save_messages.bind(this)
        this.clearCache = this.clearCache.bind(this)
    }

    async loadBroadcastsSettings() {
        return fetch(`${process.env.REACT_APP_API_URL}get_auto_broadcasts_config`)
            .then((res) => showResponse(res, "get_auto_broadcasts_config", false))
            .then(data => !data.failed && this.setState({
                messages: data.result.messages,
                randomized: data.result.randomized,
                enabled: data.result.enabled
            }))
    }

    async saveBroadcastsSettings(data) {
        return postData(`${process.env.REACT_APP_API_URL}set_auto_broadcasts_config`,
            data
        )
            .then((res) => showResponse(res, "set_auto_broadcasts_config", true))
            .then(res => !res.failed && this.setState(data))
    }

    async clearCache() {
        return postData(`${process.env.REACT_APP_API_URL}clear_cache`, {})
            .then((res) => showResponse(res, "clear_cache", true))
    }

    validate_messages() {
        let hasErrors = false
        _.forEach(this.state.messages, m => {
            const split = _.split(m, ' ')

            if (_.isNaN(_.toNumber(split[0]))) {
                toast.error(`Invalid line, must start with number of seconds: ${m}`)
                hasErrors = true
            }
        })
        return !hasErrors
    }

    save_messages() {
        if (this.validate_messages()) {
            this.saveBroadcastsSettings({ messages: this.state.messages })
        }
    }

    componentDidMount() {
        this.loadBroadcastsSettings()
    }

    render() {
        const { messages, enabled, randomized } = this.state
        const { classes } = this.props 

        return (
            <Grid container >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <h2>Advanced RCON settings</h2>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justify="space-evenly">
                            <Grid item>
                                <Padlock handleChange={v => this.saveBroadcastsSettings({ enabled: v })} checked={enabled} label="Auto broadcast enabled" />
                            </Grid>
                            <Grid item>
                                <Padlock handleChange={v => this.saveBroadcastsSettings({ randomized: v })} checked={randomized} label="Randomized messages" />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Auto broadcast messages"
                            multiline
                            rows={8}
                            value={_.join(messages, '\n')}
                            onChange={(e) => this.setState({ messages: _.split(e.target.value, '\n') })}
                            placeholder="Insert your messages here, one per line, with format: <number of seconds to display> <a message>"
                            variant="outlined"
                            helperText="You can use the following variables in the text (nextmap, maprotation, servername, onlineadmins) using the followin syntax: 60 Welcome to {servername}. The next map is {nextmap}."
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth onClick={this.save_messages} variant="outlined">Save messages</Button>
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignContent="center" justify="center" alignItems="center" className={classes.root}>
                    <Grid item xs={4} className={`${classes.padding} ${classes.margin}`}>
                        <Button fullWidth color="secondary" variant="outlined"  onClick={this.clearCache}>Clear application cache</Button>
                    </Grid>
                </Grid>
            </Grid>

        )
    }
}


export default RconSettings