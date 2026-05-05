import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../../../src/infrastructure/middleware/authMiddleware";

describe("authMiddleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it("should call next() when authorization header is valid", () => {
    mockRequest.headers = {
      authorization: "Bearer mock-token",
    };

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should return 401 when authorization header is missing", () => {
    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should return 401 when authorization header is invalid", () => {
    mockRequest.headers = {
      authorization: "invalid-token",
    };

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
