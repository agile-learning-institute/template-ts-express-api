import TopicController from './TopicController';
import TopicService from '../services/TopicService';
import { decodeToken, createBreadcrumb } from '@agile-learning-institute/mentorhub-ts-api-utils';
import { Request, Response } from 'express';

// Mock dependencies
jest.mock('../services/TopicService');
jest.mock('@agile-learning-institute/mentorhub-ts-api-utils', () => ({
    decodeToken: jest.fn(),
    createBreadcrumb: jest.fn(),
  }));
  
describe('TopicController', () => {
    let controller: TopicController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        controller = new TopicController();

        // Mock Request
        mockRequest = {
            query: { name: 'John Doe' },
            ip: '192.168.1.1',
            headers: { 'x-correlation-id': 'test-correlation-id' }
        };

        // Mock Response
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks between tests
    });

    it('should return topic and log success', async () => {
        const mockToken = { userId: 'aaaa00000000000000000001', roles: ['Staff'] };
        const mockBreadcrumb = { atTime: '2024-12-18T18:17:58.000Z', byUser: 'aaaa00000000000000000001', fromIp: '192.168.1.1', correlationId: 'test-correlation-id' };
        const mockResults = [{ name: 'John Doe', age: 30 }];

        // Mock functions
        (decodeToken as jest.Mock).mockReturnValue(mockToken);
        (createBreadcrumb as jest.Mock).mockReturnValue(mockBreadcrumb);
        (TopicService.FindTopic as jest.Mock).mockResolvedValue(mockResults);

        // Call the method
        await controller.getTopic(mockRequest as Request, mockResponse as Response);

        // Assertions
        expect(decodeToken).toHaveBeenCalledWith(mockRequest);
        expect(createBreadcrumb).toHaveBeenCalledWith(mockToken, mockRequest);
        expect(TopicService.FindTopic).toHaveBeenCalledWith(mockRequest.query, mockToken);
        expect(mockResponse.json).toHaveBeenCalledWith(mockResults);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors and log failure', async () => {
        const mockToken = { userId: 'aaaa00000000000000000001', roles: ['Staff'] };
        const mockBreadcrumb = { atTime: '2024-12-18T18:17:58.000Z', byUser: 'aaaa00000000000000000001', fromIp: '192.168.1.1', correlationId: 'test-correlation-id' };
        const mockError = new Error('FindTopic Failed');

        // Mock functions
        (decodeToken as jest.Mock).mockReturnValue(mockToken);
        (createBreadcrumb as jest.Mock).mockReturnValue(mockBreadcrumb);
        (TopicService.FindTopic as jest.Mock).mockRejectedValue(mockError);

        // Call the method
        await controller.getTopic(mockRequest as Request, mockResponse as Response);

        // Assertions
        expect(decodeToken).toHaveBeenCalledWith(mockRequest);
        expect(createBreadcrumb).toHaveBeenCalledWith(mockToken, mockRequest);
        expect(TopicService.FindTopic).toHaveBeenCalledWith(mockRequest.query, mockToken);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
});