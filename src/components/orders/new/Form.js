import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormattedMessage, useIntl } from "react-intl";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

const STORE_NAME = process.env.REACT_APP_STORE_NAME;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    height: "auto",
    marginTop: "0.7rem",
  },
  paper: {
    margin: theme.spacing(3, 6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 1),
  },
  warn: {
    color: "#cc5500",
    backgroundColor: "#FFF4E5",
    borderRadius: "5px",
    height: "2rem",
    fontSize: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "15rem",
  },
  formControl: {
    minWidth: 120,
    marginTop: 10,
    "& .MuiOutlinedInput-input": {
      padding: "12px 14px",
      textAlign: "left",
    },
  },
}));

export default function InputForm({ handleSubmit, handleChange, info, typeOptions }) {
  const classes = useStyles();
  const { formatMessage } = useIntl();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            <FormattedMessage id="newOrderCreation" defaultMessage="New Order Creation" />
          </Typography>
          <div className={classes.warn}>
            <Typography>
              <FormattedMessage id="fillAllFields" defaultMessage="Please fill all the fields!" />
            </Typography>
          </div>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="customer"
              label={formatMessage({
                id: "customer",
                defaultMessage: "Customer",
              })}
              name="customer"
              autoComplete="customer"
              type="text"
              onChange={handleChange}
              autoFocus
              value={info.customer}
            />
            <FormControl
              variant="outlined"
              fullWidth
              margin="dense"
              className={classes.formControl}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                {formatMessage({
                  id: "supplier",
                  defaultMessage: "Supplier",
                })}
              </InputLabel>
              {STORE_NAME === "Linen Serisi" ||
              STORE_NAME === "Kadife-1" ||
              STORE_NAME === "Mina" ||
              STORE_NAME === "Güneş Tekstil" ? (
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  required
                  fullWidth
                  value={info.supplier}
                  onChange={handleChange}
                  name="supplier"
                  label="Supplier"
                >
                  <MenuItem value={"umraniye"}>Umraniye</MenuItem>
                </Select>
              ) : (
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  required
                  fullWidth
                  value={info.supplier}
                  onChange={handleChange}
                  name="supplier"
                  label="Supplier"
                >
                  <MenuItem value={"asya"}>Asya</MenuItem>
                  <MenuItem value={"beyazit"}>Beyazit</MenuItem>
                </Select>
              )}
            </FormControl>
            {STORE_NAME === "Linen Serisi" ||
            STORE_NAME === "Kadife-1" ||
            STORE_NAME === "Mina" ||
            STORE_NAME === "Güneş Tekstil" ? (
              <>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="type"
                  label={formatMessage({
                    id: "type",
                    defaultMessage: "Type",
                  })}
                  type="text"
                  id="type"
                  autoComplete="type"
                  onChange={handleChange}
                  value={info.type}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="color"
                  label={formatMessage({
                    id: "color",
                    defaultMessage: "Color",
                  })}
                  type="text"
                  id="color"
                  autoComplete="color"
                  onChange={handleChange}
                  value={info.color}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="size"
                  label={formatMessage({
                    id: "size",
                    defaultMessage: "Size",
                  })}
                  type="text"
                  id="size"
                  autoComplete="size"
                  onChange={handleChange}
                  value={info.size}
                />
              </>
            ) : (
              <>
                <FormControl
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  className={classes.formControl}
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    {formatMessage({
                      id: "type",
                      defaultMessage: "Type",
                    })}
                  </InputLabel>
                  <Select
                    onChange={handleChange}
                    required
                    fullWidth
                    name="type"
                    label="Type"
                    value={info.type}
                  >
                    {typeOptions?.map(item => (
                      <MenuItem key={item.desc} value={item.desc}>
                        {item.desc}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="length"
                  label={formatMessage({
                    id: "length",
                    defaultMessage: "Length",
                  })}
                  type="text"
                  id="length"
                  autoComplete="length"
                  onChange={handleChange}
                  value={info.length}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="color"
                  label={formatMessage({
                    id: "color",
                    defaultMessage: "Color",
                  })}
                  type="text"
                  id="color"
                  autoComplete="color"
                  onChange={handleChange}
                  value={info.color}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="qty"
                  label={formatMessage({
                    id: "quantity",
                    defaultMessage: "Quantity",
                  })}
                  type="text"
                  id="qty"
                  autoComplete="qty"
                  onChange={handleChange}
                  value={info.qty}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="size"
                  label={formatMessage({
                    id: "size",
                    defaultMessage: "Size",
                  })}
                  type="text"
                  id="size"
                  autoComplete="size"
                  onChange={handleChange}
                  value={info.size}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="start"
                  label={formatMessage({
                    id: "start",
                    defaultMessage: "Start",
                  })}
                  type="text"
                  id="start"
                  autoComplete="start"
                  onChange={handleChange}
                  value={info.start}
                />
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="space"
                  label={formatMessage({
                    id: "space",
                    defaultMessage: "Space",
                  })}
                  type="text"
                  id="space"
                  autoComplete="space"
                  onChange={handleChange}
                  value={info.space}
                />
              </>
            )}
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="explanation"
              label={formatMessage({
                id: "explanation",
                defaultMessage: "Explanation",
              })}
              type="text"
              id="explanation"
              autoComplete="explanation"
              onChange={handleChange}
              value={info.explanation}
            />

            {STORE_NAME === "Yildiz Serisi" ? (
              <FormControl
                variant="outlined"
                fullWidth
                margin="dense"
                className={classes.formControl}
                required
              >
                <InputLabel id="demo-simple-select-outlined-label-2">
                  {formatMessage({
                    id: "shop",
                    defaultMessage: "Shop",
                  })}
                </InputLabel>

                <Select
                  labelId="demo-simple-select-outlined-label-2"
                  id="demo-simple-select-outlined"
                  required
                  fullWidth
                  value={info.shop}
                  onChange={handleChange}
                  name="shop"
                  label="Shop"
                >
                  <MenuItem value={"Amazon"}>Amazon</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
                </Select>
              </FormControl>
            ) : null}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              <FormattedMessage id="create" defaultMessage="Create" />
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
