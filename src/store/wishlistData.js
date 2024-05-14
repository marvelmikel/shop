import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import auth from "../../utils/auth";
const initialState = {
  wishlistData: null,
  status: null,
};
export const fetchWishlist = createAsyncThunk(
  "WISHLIST/fetchWishlist",
  async () => {
    if (auth()) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/wishlist?token=${
          auth().access_token
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      return data;
    }
    return false;
  }
);

export const wishlistAction = createSlice({
  name: "WISHLIST",
  initialState,
  extraReducers: {
    [fetchWishlist.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchWishlist.fulfilled]: (state, { payload }) => {
      (state.wishlistData = payload), (state.status = "success");
    },
    [fetchWishlist.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});

export default wishlistAction.reducer;
