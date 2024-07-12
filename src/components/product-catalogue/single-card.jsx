import React from "react";
import PropTypes from "prop-types";
import { Card, Typography, Modal } from "antd";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useDrag } from "react-dnd";
import { motion, useAnimation } from "framer-motion";
import { Constants } from "../../utils/Constants";
import CardCarousel from "./card-carousel";
import { useSelector } from "react-redux";

const { Paragraph, Text } = Typography;

const DRAG_ICON_STYLE = {
  cursor: "grab",
  fontSize: "20px",
  color: "white",
  zIndex: 10,
  marginRight: "9px",
  marginLeft: "11px",
  marginTop: "2px",
  width: "15px",
};

function SingleCard(props) {
  const {
    item,
    highlighted: shadow,
    onSelectItem,
    selected: dark,
    marked: markedTexts,
    dropable,
    images,
    ...restProps
  } = props;
  const [check, setCheck] = React.useState(false);
  const [rightMenuClicked, setRightMenuClicked] = React.useState(false);
  const controls = useAnimation(); // Initialize Framer Motion's animation controls
  const selectedProduct = useSelector(
    (state) => state.productReducer.selectedProduct
  );

  React.useEffect(() => {
    if (dark) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  }, [item.id, dark]);

  const onClick = React.useCallback(() => {
    setCheck(!check);
    onSelectItem(item.id);
  }, [check, item, onSelectItem]);

  const title = React.useMemo(() => {
    const { title } = item || {};
    if (markedTexts?.length) {
      let array = [{ text: title, marked: false }];
      markedTexts.forEach((token) => {
        const modifiedArray = [];
        array.forEach((item) => {
          if (item.marked) {
            modifiedArray.push(item);
            return;
          }
          const re = new RegExp(token, "i");
          const splitted = item.text.split(re);
          if (splitted.length === 1) {
            const text = splitted[0];
            modifiedArray.push({ text, marked: false });
          } else {
            splitted.forEach((text, index) => {
              if (index === 0 && !text) {
                modifiedArray.push({ text: token, marked: true });
              } else {
                modifiedArray.push({ text, marked: false });
                // not last
                if (index !== splitted.length - 1) {
                  modifiedArray.push({ text: token, marked: true });
                }
              }
            });
          }
        });
        array = modifiedArray;
      });

      array = array.map((item) => {
        const { text, marked } = item;
        return (
          <Text mark={marked} style={{ color: "white", textAlign: "left" }}>
            {text}
          </Text>
        );
      });

      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <Paragraph>{array}</Paragraph>;
    }
    return (
      <Text
        style={{
          color: "white",
          textAlign: "left",
          fontSize: "12px",
          fontFamily: Constants.FONT_FAMILY_POPPINS,
        }}
      >
        {title}
      </Text>
    );
  }, [item, markedTexts]);

  const cardModal = React.useMemo(() => {
    if (!rightMenuClicked) return null;
    return (
      <Modal
        title={title}
        open={rightMenuClicked}
        footer={null}
        width={563}
        onCancel={() => setRightMenuClicked(false)}
        closeIcon={
          <AiOutlineClose
            style={{
              color: "black",
              fontSize: "20px",
              cursor: "pointer",
              zIndex: 10,
              border: "1px solid #F8F9F9",
              borderRadius: "8px",
              padding: "5px",
            }}
          />
        }
        className="single-card-modal"
      >
        <CardCarousel data={images} height="300px" />
      </Modal>
    );
  }, [images, rightMenuClicked, title]);

  const [{ isDragging, opacity }, drag, preview] = useDrag({
    type: "PRODUCT",
    item: { item, type: "PRODUCT" },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      const didDrop = monitor.didDrop();
      // You can perform additional actions based on whether the item was dropped or not
    },

    // collect: (monitor) => ({
    //   isDragging: monitor.isDragging(),
    //   // opacity: monitor.isDragging() ? 0 : 1,
    // }),
    collect: (monitor) => {
      // console.log('Collecting drag information:', monitor.getItem(), monitor.isDragging())
      return {
        isDragging: monitor.isDragging(),
        opacity: monitor.isDragging() ? 0.7 : 1,
      };
    },
  });

  // Animate when dragging starts
  React.useEffect(() => {
    if (isDragging) {
      controls.start({ scale: 0.9, opacity: 0.9 });
    } else {
      controls.start({ scale: 1, opacity: 1 });
    }
  }, [isDragging, controls]);

  return (
    <>
      <motion.div animate={controls} className="w-full" ref={preview}>
        <Card
          {...restProps}
          bordered={false}
          style={{
            width: "100%",
            boxShadow: shadow ? "rgb(214 245 245) 0px 0px 8px 3px" : null,
            // boxShadow: shadow ? 'rgb(214 245 245) 0px 0px 8px 3px' : 'rgb(214 245 245) 0px 0px 1px 1px',
            // backgroundColor: dark ? Constants.PRIMARY_COLOR : Constants.PRIMARY_COLOR_LITE,
            backgroundColor:
              selectedProduct === item?.id ? "#F28C28" : Constants.TEXT_COLOR,
            margin: "5px 0",
            height: "40px",
            fontFamily: Constants.FONT_FAMILY_POPPINS,
          }}
          bodyStyle={{
            padding: "10px 4px",
            display: "flex",
            // alignItems: 'center',
            justifyContent: "left",
          }}
          // onClick={onClick}
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setRightMenuClicked(true);
          }}
          className="single_card"
          onClick={onClick}
          ref={drag}
        >
          <div>
            <AiOutlineMenu
              style={DRAG_ICON_STYLE}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </div>

          <Typography.Paragraph
            ellipsis={{
              rows: 1,
              expandable: false,
            }}
            style={{
              marginBottom: "0",
              fontFamily: Constants.FONT_FAMILY_POPPINS,
            }}
          >
            {title}
          </Typography.Paragraph>
        </Card>
        {cardModal}
      </motion.div>
    </>
  );
}

SingleCard.propTypes = {
  item: PropTypes.object,
  highlighted: PropTypes.bool,
  onSelectItem: PropTypes.func,
  selected: PropTypes.bool,
  marked: PropTypes.arrayOf(PropTypes.string),
  dropable: PropTypes.object,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      key: PropTypes.string,
    })
  ),
};

SingleCard.defaultProps = {
  item: {},
  highlighted: false,
  onSelectItem: () => {},
  selected: false,
  marked: [],
  dropable: {},
  images: [],
};

export default SingleCard;
