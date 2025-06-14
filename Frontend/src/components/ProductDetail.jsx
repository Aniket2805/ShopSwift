import React, { useContext, useState, useEffect } from "react";
import { Context } from "../context/contextAPI";
import { fetchDataFromExternalAPI } from "../utils/api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCartShopping } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { app, auth, db } from "../context/firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  deleteField,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { setloading } = useContext(Context);
  const { id } = useParams();
  const [productDetail, setproductDetail] = useState();
  const [addToCart, setaddToCart] = useState(false);
  const [count, setCount] = useState(1);
  const product = {
    product_id: productDetail?.product_id,
    product_title: productDetail?.product_title,
    price: productDetail?.offer?.price,
    image: productDetail?.product_photos[0],
    lastUpdated: new Date(),
  };
  const notify = (msg) => {
    toast(msg);
  };
  const addProduct = () => {
    const cartRef = doc(db, "cart", auth?.currentUser?.uid);
    product["count"] = count;
    const data = { [product?.product_id]: product };
    setDoc(cartRef, data, { merge: true });
  };
  const deleteProduct = () => {
    const cartRef = doc(db, "cart", auth?.currentUser?.uid);
    updateDoc(cartRef, {
      [product?.product_id]: deleteField(),
    });
  };
  const getData = () => {
    const cartRef = doc(db, "cart", auth?.currentUser?.uid);
    getDoc(cartRef)
      .then((res) => {
        res?.data() != null &&
          Object.keys(res?.data()).map((productId) => {
            if (productId == id) {
              setaddToCart(true);
            }
          });
      })
      .catch((err) => {
        console.log(err?.message);
      });
  };
  const handleIncrement = () => {
    setCount(count + 1);
  };
  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const fetchProductDetail = (id) => {
    setloading(true);
    fetchDataFromExternalAPI(
      `product-details-v2?product_id=${id}&country=in&language=en`
    )
      .then((response) => {
        console.log(response.data);
        setproductDetail(response?.data);
        setloading(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  useEffect(() => {
    if (auth != null && auth.currentUser != null) {
      getData();
    }
    fetchProductDetail(id);
  }, [id]);
  return (
    <div className="py-[40px] px-[20px] sm:px-[40px] lg:px-[80px] ">
      <section id="pro_detail" className="flex flex-col md:flex-row">
        <div className="pro_image mr-[20px] lg:mr-[50px] w-[100%] md:w-[60%]">
          <img
            src={productDetail?.product_photos[0]}
            id="mainimg"
            className="w-full h-[18rem] min-[400px]:h-[26rem] min-[500px]:h-[35rem] object-contain"
            alt=""
          />
          <div className="small_img_group grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-6">
            {productDetail?.product_photos?.map((photo) => {
              return (
                <div className="smallimg" key={photo}>
                  <img
                    src={photo}
                    className="small_img h-[4rem] min-[400px]:h-[6rem] sm:h-[8rem] object-contain"
                    onClick={() => {
                      document.getElementById("mainimg").src = photo;
                    }}
                    width="100%"
                    alt=""
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="single_pro_detail md:w-[50%]">
          <h6>Home / Shop</h6>
          <h4 className="text-3xl lg:text-4xl font-semibold font-mono">
            {productDetail?.product_title}
          </h4>
          <h5 className="text-xl font-semibold text-green-800">
            {productDetail?.product_rating}
            <i className="fas fa-star text-lg text-yellow-500"></i>
          </h5>
          <h2 className="my-2">{productDetail?.offer?.price}</h2>
          <div className="py-[20px]">
            <i
              className="fas fa-minus px-4 cursor-pointer"
              onClick={handleDecrement}
            ></i>
            <input
              id={productDetail?.product_id}
              type="number"
              value={count}
              readOnly
              className="w-[60px] outline-none border-2 px-2 py-1 rounded-md text-center"
            />
            <i
              className="fas fa-plus px-4 cursor-pointer"
              onClick={handleIncrement}
            ></i>
          </div>
          <button
            className="normal w-[100%] sm:w-[13rem] flex items-center justify-center shadow-xl"
            onClick={() => {
              if (auth?.currentUser == null) {
                navigate("/signin");
              } else {
                setaddToCart(!addToCart);
                !addToCart ? addProduct() : deleteProduct();
                if (!addToCart) {
                  notify("Product added to cart");
                } else {
                  notify("Product deleted from cart");
                }
              }
            }}
          >
            {!addToCart ? (
              <p className="flex items-center justify-center">
                <FaCartShopping className="mr-2" /> Add To Cart
              </p>
            ) : (
              <p className="flex items-center justify-center">
                <MdDelete className="mr-2 text-xl" /> Remove From Cart
              </p>
            )}
          </button>
          <button className="normal buy w-[100%] sm:w-[13rem] shadow-xl">
            <p>Buy Now</p>
          </button>
          <div className="mt-5">
            <p className="text-2xl mb-4 text-green-900 font-semibold font-mono border-t-2 border-green-800 border-b-2 py-4">
              Product Details
            </p>
            {productDetail?.product_details &&
              Object.entries(productDetail?.product_details).map(
                ([key, value]) => {
                  return (
                    <p key={key}>
                      <span className="text-green-900 font-semibold">
                        {key + " : "}
                      </span>
                      {value}
                    </p>
                  );
                }
              )}
          </div>
          <div className="mt-5">
            <p className="text-2xl mb-4 text-green-900 font-semibold font-mono border-t-2 border-green-800 border-b-2 py-4">
              Product Specification
            </p>
            {productDetail?.product_specs &&
              Object.entries(productDetail?.product_specs).map(
                ([key, value]) => {
                  return (
                    <p key={key}>
                      <span className="text-green-900 font-semibold">
                        {key + " : "}
                      </span>
                      {value}
                    </p>
                  );
                }
              )}
          </div>
        </div>
      </section>
      <div className="mt-4">
        <p className="text-2xl mb-4 text-green-900 font-semibold font-mono border-t-2 border-green-800 border-b-2 py-4">
          Description
        </p>
        <span>{productDetail?.product_description}</span>
      </div>
    </div>
  );
};

export default ProductDetail;
