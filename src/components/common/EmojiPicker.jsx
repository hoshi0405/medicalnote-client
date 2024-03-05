import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react'
import  Picker  from "@emoji-mart/react";

const EmojiPicker = (props) => {

  const [slectedEmoji, setSlectedEmoji] = useState();
  const [isShowPicker, setIsShowPicker] = useState(false);

  useEffect(() => {
    setSlectedEmoji(props.icon);
  }, [props.icon]);

  const showPicker = () => setIsShowPicker(!isShowPicker);

  const selectEmoji = (e) => {
    const emojiCode = e.unified.split("-");
    let codesArray = [];
    emojiCode.forEach((el) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);
    setIsShowPicker(false)
    props.onChange(emoji)
  }

  return (
    <Box>
      <Typography variant="h4" fontSize="700" sx={{ cursor:"pointer"}} onClick={showPicker}>
       {slectedEmoji}
      </Typography>
      <Box sx={{display: isShowPicker ? "block" :"none", position:"absolute", zIndex:100}}>
        <Picker onEmojiSelect={selectEmoji}/>
        </Box>
    </Box>
  )
};

export default EmojiPicker
