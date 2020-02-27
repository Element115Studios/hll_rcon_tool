import React from "react";
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Grid, TextField, Slider, Typography,
  IconButton, Card, CardHeader, CardContent, Collapse
} from "@material-ui/core";
import { range } from "lodash/util";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { showResponse, postData } from '../../utils/fetchUtils'
import { toast } from "react-toastify";
import VipEditableList from "./vips"
import AdminsEditableList from "./admins";

function valuetext(value) {
  return `${value}`;
}

const NumSlider = ({
  classes,
  text,
  min = 0,
  max,
  value,
  marks = true,
  step = 1,
  setValue
}) => (
    <div className={classes.slider}>
      <Typography variant="h5" id="discrete-slider-always" gutterBottom>
        {text}
      </Typography>
      <Slider
        value={value}
        onChange={(e, newVal) => setValue(newVal)}
        aria-labelledby="discrete-slider-always"
        step={step}
        marks={marks}
        min={min}
        max={max}
        valueLabelDisplay="auto"
      />
    </div>
  );

const CollapseCard = ({ classes, title, children, onExpand }) => {
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
    onExpand();
  };

  return <Card>
    <CardHeader title={title} action={
      <IconButton
        className={clsx(classes.expand, {
          [classes.expandOpen]: expanded,
        })}
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
      >
        <ExpandMoreIcon />
      </IconButton>
    } />
    <Collapse in={expanded} unmountOnExit>
      <CardContent>
        {children}
      </CardContent>
    </Collapse>
  </Card>
}

class HLLSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      autoBalanceThres: 3,
      teamSwitchCooldownMin: 15,
      idleAutokickMin: 5,
      maxPingMs: 500,
      queueLength: 5,
      vipSlots: 2,
      vips: [],
      admins: [], 
      adminRoles: [],
    };

    this.loadVips = this.loadVips.bind(this)
    this.loadAdmins = this.loadAdmins.bind(this)
    this.sendAction = this.sendAction.bind(this)
  }

  componentDidMount() {
    this.loadAdminRoles()
  }

  loadVips() {
    fetch(`${process.env.REACT_APP_API_URL}get_vip_ids`)
      .then((res) => showResponse(res, "get_vip_ids", false))
      .then(data => this.setState({ vips: data.result }))
      .catch(error => toast.error("Unable to connect to API " + error));
  }

  loadAdminRoles() {
    fetch(`${process.env.REACT_APP_API_URL}get_admin_groups`)
    .then((res) => showResponse(res, "get_admin_groups", false))
    .then(data => this.setState({ adminRoles: data.result }))
    .catch(error => toast.error("Unable to connect to API " + error));
  }

  loadAdmins() {
    fetch(`${process.env.REACT_APP_API_URL}get_admin_ids`)
    .then((res) => showResponse(res, "get_admin_ids", false))
    .then(data => this.setState({ admins: data.result }))
    .catch(error => toast.error("Unable to connect to API " + error));
  }

  sendAction(command, parameters) {
    return postData(`${process.env.REACT_APP_API_URL}${command}`, parameters).then(
      (res) => showResponse(res, command, true)
    ).catch(error => toast.error("Unable to connect to API " + error));
  }

  render() {
    const {
      autoBalanceThres,
      teamSwitchCooldownMin,
      idleAutokickMin,
      maxPingMs,
      queueLength,
      vipSlots,
      vips, 
      admins, 
      adminRoles
    } = this.state;
    const { classes } = this.props;

    return (
      <Grid container spacing={3} className={classes.paper}>
        <Grid item className={classes.paper} xs={12}>
          <h1>This is not wired yet. Changing values won't have any effect</h1>
        </Grid>
        <Grid item className={classes.paper} xs={12}>
          <TextField
            fullWidth
            label="Server name"
            disabled
            helperText="The server name as displayed in the server browser"
          />
        </Grid>
        <Grid item className={classes.paper} xs={12} md={6}>
          <CollapseCard title="Manage VIPs" classes={classes} onExpand={this.loadVips}>
            <VipEditableList peopleList={vips} classes={classes}
              onAdd={
                (name, steamID64) => (
                  this.sendAction("do_add_vip", { "steam_id_64": steamID64, "name": name }).then(this.loadVips)
                )
              }
              onDelete={
                (name, steamID64) => (
                  this.sendAction("do_remove_vip", { "steam_id_64": steamID64 }).then(this.loadVips)
                )
              }
            />
          </CollapseCard>
        </Grid>
        <Grid item className={classes.paper} xs={12} md={6}>
          <CollapseCard title="Manage Console admins" classes={classes} onExpand={this.loadAdmins}>
            <p>Changes won't be visible immediately</p>
            <AdminsEditableList peopleList={admins} roles={adminRoles} classes={classes}
              onAdd={
                (name, steamID64, role) => (
                  this.sendAction("do_add_admin", { "steam_id_64": steamID64, "name": name , "role": role}).then(this.loadAdmins)
                )
              }
              onDelete={
                (name, steamID64, role) => (
                  this.sendAction("do_remove_admin", { "steam_id_64": steamID64}).then(this.loadAdmins)
                )
              }
            />
          </CollapseCard>
        </Grid>
        <Grid item className={classes.paper} xs={12} md={6}>
          <NumSlider
            classes={classes}
            text="Teamswitch cooldown (minutes)"
            max={100}
            value={teamSwitchCooldownMin}
            marks={range(0, 120, 20).map(val => ({
              value: val,
              label: `${val}`
            }))}
            getAriaValueText={valuetext}
            setValue={val => this.setState({ teamSwitchCooldownMin: val })}
          />
        </Grid>
        <Grid item className={classes.paper} xs={12} md={6}>
          <NumSlider
            classes={classes}
            text="Autobalance threshold"
            max={50}
            value={autoBalanceThres}
            marks={range(0, 60, 10).map(val => ({
              value: val,
              label: `${val}`
            }))}
            setValue={val => this.setState({ autoBalanceThres: val })}
          />
        </Grid>
        <Grid item className={classes.paper} xs={12} md={6}>
          <NumSlider
            classes={classes}
            text="Idle autokick (minutes)"
            max={100}
            step={5}
            marks={range(0, 120, 20).map(val => ({
              value: val,
              label: `${val}`
            }))}
            value={idleAutokickMin}
            setValue={val => this.setState({ idleAutokickMin: val })}
          />
        </Grid>
        <Grid item className={classes.paper} xs={12} md={6}>
          <NumSlider
            classes={classes}
            text="Maximum ping (ms)"
            max={2000}
            min={10}
            step={10}
            value={maxPingMs}
            marks={range(0, 2500, 500).map(val => ({
              value: val,
              label: `${val}`
            }))}
            setValue={val => this.setState({ maxPingMs: val })}
          />
        </Grid>
        <Grid item className={classes.paper} xs={12} md={6}>
          <NumSlider
            classes={classes}
            text="Max queue length"
            max={5}
            min={1}
            value={queueLength}
            marks={range(0, 6, 1).map(val => ({ value: val, label: `${val}` }))}
            setValue={val => this.setState({ queueLength: val })}
          />
        </Grid>
        <Grid item className={classes.paper} xs={12} md={6}>
          <NumSlider
            classes={classes}
            text="Vip slots"
            max={100}
            value={vipSlots}
            marks={range(0, 120, 20).map(val => ({
              value: val,
              label: `${val}`
            }))}
            setValue={val => this.setState({ vipSlots: val })}
          />
        </Grid>
      </Grid>
    );
  }
}

export default HLLSettings;