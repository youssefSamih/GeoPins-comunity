import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import { Input } from "@material-ui/core";
import Context from "../../context";
import axios from "axios";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";
import { useClient } from "../../client";
import { REACT_APP_CLOUDINARY } from "../../env";

const CreatePin = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const mobileSize = useMediaQuery("(max-width: 650px");

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setSubmitting(true);
      const url = await handleImageUpload();
      const { latitude, longitude } = state.draft;
      const variables = { title, image: url, content, latitude, longitude };
      /*const { createPin } =*/ await client.request(
        CREATE_PIN_MUTATION,
        variables
      );
      // console.log("Pin created", { createPin });
      // dispatch({ type: "CREATE_PIN", payload: createPin });
      handleDeleteDraft();
    } catch (err) {
      setSubmitting(false);
      console.error("Error creating pin", err);
    }
  };

  const handleDeleteDraft = () => {
    setTitle("");
    setImage("");
    setContent("");
    dispatch({ type: "DELETE_DRAFT" });
  };

  const handleImageUpload = async () => {
    const data = new FormData();
    if (image) {
      data.append("file", image);
      data.append("upload_preset", "geopins");
      data.append("cloud_name", "youssefsamih");
      const res = await axios.post(`${REACT_APP_CLOUDINARY}`, data);
      // console.log(data.file);
      return res.data.url;
    }
  };

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge} /> Pin Location
      </Typography>
      <div>
        <TextField
          name="title"
          label="Title"
          placeholder="Insert pin title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          accept="image/*"
          id="image"
          type="file"
          className={classes.input}
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="image">
          <Button
            style={{ color: image && "green" }}
            component="span"
            size="small"
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="Content"
          multiline
          rows={mobileSize ? "3" : "6"}
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim() || !image || submitting}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  );
};

const styles = (theme) => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit,
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%",
  },
  input: {
    display: "none",
  },
  alignCenter: {
    display: "flex",
    alignItems: "center",
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit,
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0,
  },
});

export default withStyles(styles)(CreatePin);
