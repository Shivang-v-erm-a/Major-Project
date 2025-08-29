 import React, { useRef, useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import Help from "./Help";
import { MdArrowOutward } from "react-icons/md";

const ModelViewer = ({ item, addToWishlist, removeFromWishlist, wishlist }) => {
  const [display, setDisplay] = useState(false);
  const [ARSupported, setARSupported] = useState(false);
  const [annotate, setAnnotate] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const model = useRef();
  const variantRef = useRef(null);

  const modelViewerStyle = {
    backgroundColor: "#ecf0f3",
    overflowX: "hidden",
    posterColor: "#eee",
    width: "100%",
    height: ARSupported ? "85%" : "75%",
    borderRadius: "15px",
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) model.current.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
  };

  const handleAnnotateClick = (annotation) => {
    if (!model.current) return;
    const { target, position } = annotation;
    model.current.cameraTarget = position;
    model.current.orbit = target;
  };

  // Detect AR support on mobile
  useEffect(() => {
    if (/iPhone|webOS|Android|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent)) {
      setARSupported(true);
    }
  }, []);

  // Setup variants when model loads
  useEffect(() => {
    const modelViewer = model.current;
    const variantSelect = variantRef.current; // Copy ref to local variable

    if (!modelViewer || !variantSelect) return;

    const onLoad = () => {
      const variants = modelViewer?.availableVariants || [];
      variants.forEach((v) => {
        const option = document.createElement("option");
        option.value = v;
        option.textContent = v;
        variantSelect.appendChild(option);
      });

      // Default option
      const defaultOption = document.createElement("option");
      defaultOption.value = "Default";
      defaultOption.textContent = "Default";
      variantSelect.appendChild(defaultOption);
    };

    const onInput = (event) => {
      modelViewer.variantName = event.target.value === "Default" ? null : event.target.value;
    };

    modelViewer.addEventListener("load", onLoad);
    variantSelect.addEventListener("input", onInput);

    // Cleanup safely
    return () => {
      modelViewer.removeEventListener("load", onLoad);
      variantSelect.removeEventListener("input", onInput);
    };
  }, []);

  // Wishlist state
  useEffect(() => {
    if (wishlist) setIsInWishlist(wishlist.some((w) => w.id === item.id));
  }, [item, wishlist]);

  const handleAddToWishlist = () => {
    if (isInWishlist) removeFromWishlist(item.id);
    else addToWishlist(item);
  };

  return (
    <div className="model-view">
      <model-viewer
        key={item.id}
        ref={model}
        style={modelViewerStyle}
        src={item.modelSrc}
        ios-src={item.iOSSrc}
        alt="3D model"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
      >
        {ARSupported && (
          <button slot="ar-button" className="arbutton">
            View in your space
          </button>
        )}

        <button className="fullscreen-btn" onClick={toggleFullscreen}>
          &#x26F6;<span> Fullscreen</span>
        </button>

        {display ? (
          <>
            <button
              className={document.fullscreenElement ? "close fz" : "close"}
              onClick={() => setDisplay(false)}
            >
              &#10006;
            </button>
            <Help />
          </>
        ) : (
          <button className="help-btn" onClick={() => setDisplay(true)}>
            ?<span> Help</span>
          </button>
        )}

        <button className="annotate-btn" onClick={() => setAnnotate((prev) => !prev)}>
          i
        </button>

        {annotate &&
          item.annotations?.map((annotation, idx) => (
            <button
              key={idx}
              className="Hotspot"
              slot={annotation.slot}
              data-position={annotation.position}
              data-normal={annotation.normal}
              data-orbit={annotation.orbit}
              data-target={annotation.target}
              data-visibility-attribute="visible"
              onClick={() => handleAnnotateClick(annotation)}
            >
              <div className="HotspotAnnotation">{annotation.title}</div>
            </button>
          ))}

        <div className="controls variant_div">
          <select ref={variantRef} id="variant"></select>
        </div>
      </model-viewer>

      <div className="qr-sec">
        {!ARSupported && (
          <LazyLoadImage
            src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(window.location.href)}`}
            alt="QR Code"
            effect="blur"
            style={{ width: "110px", height: "110px", objectFit: "cover", marginBottom: "5px" }}
          />
        )}

        <div className="product-details">
          <div>
            <div className="pname">{item.name}</div>
            <div className="rating-sec">
              <div>Rating</div>
              <div>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
              </div>
            </div>
            <div style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginTop: "10px",
              background: 'black',
              color: 'white',
              padding: '6px',
              borderRadius: '60px'
            }}>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center', fontWeight: 'bold' }}>
                Rs. 1000
                <MdArrowOutward />
              </div>
            </div>
          </div>

          <button
            className="add-icon"
            onClick={handleAddToWishlist}
            style={{
              background: isInWishlist ? "red" : "black",
              color: "white",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease",
              marginLeft: "auto",
            }}
          >
            {isInWishlist ? "-" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;
