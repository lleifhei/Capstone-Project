import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

// Async thunk for fetching reviews
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get('/reviews', { 
        params: { page, limit, ...filters } 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for submitting a new review
export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    featuredReviews: [],
    currentReview: null,
    userReviews: [],
    draftReview: null,
    filters: {
      genre: null,
      rating: null,
      year: null,
      artist: null
    },
    sort: {
      field: 'publishedAt',
      direction: 'desc'
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    loading: {
      list: false,
      submit: false,
      detail: false
    },
    errors: {
      list: null,
      submit: null,
      detail: null
    }
  },
  reducers: {
    // Set current review (when viewing details)
    setCurrentReview: (state, action) => {
      state.currentReview = action.payload;
    },
    
    // Update filters
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
      // Reset pagination when filtering
      state.pagination.page = 1;
    },
    
    // Update sort options
    updateSort: (state, action) => {
      state.sort = {
        ...state.sort,
        ...action.payload
      };
    },
    
    // Save draft review
    saveDraft: (state, action) => {
      state.draftReview = {
        ...state.draftReview,
        ...action.payload,
        lastSaved: new Date().toISOString()
      };
    },
    
    // Clear draft
    clearDraft: (state) => {
      state.draftReview = null;
    },
    
    // Like/unlike a review
    toggleLike: (state, action) => {
      const { reviewId, liked } = action.payload;
      const review = state.items.find(r => r.id === reviewId);
      
      if (review) {
        review.isLiked = liked;
        review.likeCount = liked 
          ? review.likeCount + 1 
          : Math.max(0, review.likeCount - 1);
      }
      
      if (state.currentReview?.id === reviewId) {
        state.currentReview.isLiked = liked;
        state.currentReview.likeCount = liked 
          ? state.currentReview.likeCount + 1 
          : Math.max(0, state.currentReview.likeCount - 1);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchReviews states
      .addCase(fetchReviews.pending, (state) => {
        state.loading.list = true;
        state.errors.list = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading.list = false;
        state.items = action.payload.reviews;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        };
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading.list = false;
        state.errors.list = action.payload || 'Failed to fetch reviews';
      })
      
      // Handle submitReview states
      .addCase(submitReview.pending, (state) => {
        state.loading.submit = true;
        state.errors.submit = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.loading.submit = false;
        // Add new review to list if it's the current page
        state.items = [action.payload, ...state.items];
        // Clear draft after successful submission
        state.draftReview = null;
        // Update user reviews if available
        if (state.userReviews.length) {
          state.userReviews = [action.payload, ...state.userReviews];
        }
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading.submit = false;
        state.errors.submit = action.payload || 'Failed to submit review';
      });
  }
});

export const { 
  setCurrentReview, 
  updateFilters, 
  updateSort, 
  saveDraft, 
  clearDraft,
  toggleLike 
} = reviewsSlice.actions;

// Selectors
export const selectAllReviews = (state) => state.reviews.items;
export const selectFeaturedReviews = (state) => state.reviews.featuredReviews;
export const selectCurrentReview = (state) => state.reviews.currentReview;
export const selectDraftReview = (state) => state.reviews.draftReview;
export const selectReviewsLoading = (state) => state.reviews.loading;
export const selectReviewsErrors = (state) => state.reviews.errors;
export const selectReviewsFilters = (state) => state.reviews.filters;
export const selectReviewsPagination = (state) => state.reviews.pagination;

export default reviewsSlice.reducer;