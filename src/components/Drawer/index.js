import React, { useLayoutEffect, useState, Fragment } from 'react';

import { ListItem, useStyles } from './style';

import { useTheme,List, Collapse, Drawer, ListItemIcon, ListItemText, Hidden } from '@material-ui/core';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Logo from '../../assets/logo.png';

import { useHistory } from 'react-router';

import Axios from 'axios';

import { drawerItems } from './data';
import { POKE_ROOT_API } from '../../constants/poke';

export const DrawerComponent = (props) => {
    //state
    const [selectedIndex, setSelectedIndex] = useState(parseInt(sessionStorage.getItem("item")) || 1);
    const [open, setOpen] = useState(false);

    //variable
    const history = useHistory();
    const { mobileOpen, handleDrawerToggle, window } = props;
    const container = window !== undefined ? () => window().document.body : undefined;
    const classes = useStyles();
    const theme = useTheme();

    //useEffect
    useLayoutEffect(() => {
        const getRegions = async () => {
            try {
                const response = await Axios.get(`${POKE_ROOT_API}/region`);
                if (response.status === 200) {
                    const routers = response.data.results.map((item, index) => {
                        return {
                            id: (index + 1 + drawerItems.length),
                            text: item.name.charAt(0).toUpperCase() + item.name.substring(1) ,
                            to: `/regions/${item.name}`
                        }
                    })
                    drawerItems[1].children = routers;
                }
            } catch (e) {
                console.log(e);
            }
        }
        getRegions();
    }, [])

    //function
    const handleListItemClick = (event, index, path, hasChildren, fatherIndex) => {
        sessionStorage.setItem("item", fatherIndex);
        setSelectedIndex(index);
        if (path) {
            history.push(path)
            setOpen(false)
            setSelectedIndex(fatherIndex)
        }
        if(hasChildren){
            setOpen(!open)
        }
    };

    //reused component
    const drawer = (isMobile) => {
        return <div>
            {isMobile ? <img className={classes.logo} src={Logo} width="200px" height="auto" alt="logo" /> : <div className={classes.toolbar} />}
            <Fragment>
                {drawerItems.map((item, index) => (
                    <Fragment key={index}>
                        <ListItem button onClick={e => handleListItemClick(e, item.id, item.to, item.children, item.id)} selected={selectedIndex === item.id}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                            {item.children ? (open ? <ExpandLess /> : <ExpandMore />) : null}
                        </ListItem>
                        {item.children ? <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {item.children.map((itemChildren) => {
                                    return (<ListItem
                                        button
                                        className={classes.nested}
                                        selected={selectedIndex === itemChildren.id}
                                        onClick={e => handleListItemClick(e, itemChildren.id, itemChildren.to, itemChildren.children, item.id)}
                                        key={itemChildren.id}
                                    >
                                        <ListItemIcon>{itemChildren.icon}</ListItemIcon>
                                        <ListItemText primary={itemChildren.text} />
                                    </ListItem>)
                                })}
                            </List>
                        </Collapse> : null}
                    </Fragment>
                ))}
            </Fragment>
        </div>
    }

    //render
    return (
        <nav className={classes.drawer} aria-label="mailbox folders">
            <Hidden smUp implementation="css">
                <Drawer
                    container={container}
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true,
                    }}
                >
                    {drawer(theme.breakpoints.up('sm'))}
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                >
                    {drawer(!theme.breakpoints.up('sm'))}
                </Drawer>
            </Hidden>
        </nav>
    )
}



