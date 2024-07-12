import React from 'react'
import PropTypes from 'prop-types'
import { Empty, Image as AntImage } from 'antd'
import { Carousel } from 'react-responsive-carousel'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { RedoOutlined } from '@ant-design/icons'

function ImageRender({ url, style }) {
  const [largeHeight, setLargeHeight] = React.useState(true)

  const getMetaAsync = React.useCallback(
    (url) =>
      new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject()
        img.src = url
      }),
    []
  )

  React.useEffect(() => {
    const setImageDimension = async () => {
      const img = await getMetaAsync(url)
      setLargeHeight(img.naturalHeight >= img.naturalWidth)
    }

    setImageDimension()
  }, [getMetaAsync, url])

  return (
    <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0}>
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <div className="tools">
            <button onClick={() => zoomIn()} className="zoomButton">
              +
            </button>
            <button onClick={() => zoomOut()} className="zoomButton">
              -
            </button>
            <button onClick={() => resetTransform()} className="resetButton">
              <RedoOutlined />
            </button>
          </div>
          <TransformComponent>
            <img src={url} alt="test" style={{ ...style, width: '100%', height: '100%' }} />

            {/* <AntImage
              preview={false}
              src={url}
              style={{
                width: largeHeight ? 'auto' : '100%',
                height: largeHeight ? '100%' : 'auto',
                maxHeight: '300px',
                maxWidth: '300px',
                ...style,
              }}
            /> */}
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  )
}

ImageRender.propTypes = {
  url: PropTypes.string.isRequired,
  style: PropTypes.object,
}

ImageRender.defaultProps = {
  style: {},
}

function CardCarousel(props) {
  const { width, data, height, imageStyle, enableThumbnails } = props

  const renderThumbnails = React.useCallback(
    () =>
      enableThumbnails &&
      data.map((item) => (
        <div
          key={item.key}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 'auto',
            width: '60px',
            height: '60px',
          }}
        >
          <AntImage preview={false} src={item.url} style={{ width: '60px' }} />
        </div>
      )),
    [data, enableThumbnails]
  )

  const renderItem = React.useCallback(
    (key) => (
      <>
        {data
          .filter((item) => item.key === key)
          .map((item) => (
            <div
              style={{
                height,
              }}
              key={item.key}
            >
              <ImageRender url={item.url} style={imageStyle} />
            </div>
          ))}
      </>
    ),
    [data, height, imageStyle]
  )

  if (!data?.length) return <Empty />
  return (
    <Carousel
      width={width}
      dynamicHeight={false}
      autoPlay={false}
      infiniteLoop
      showStatus={false}
      renderThumbs={renderThumbnails}
      onChange={() => null}
      swipeable
      renderItem={renderItem}
    >
      {data.map((item) => item.key)}
    </Carousel>
  )
}

CardCarousel.propTypes = {
  width: PropTypes.string,
  data: PropTypes.array.isRequired,
  height: PropTypes.string,
  imageStyle: PropTypes.object,
  enableThumbnails: PropTypes.bool,
}

CardCarousel.defaultProps = {
  width: '500px',
  height: '100px',
  imageStyle: {},
  enableThumbnails: true,
}

export default CardCarousel
