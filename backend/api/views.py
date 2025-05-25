from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import *
from rest_framework.views import APIView
from rest_framework import status as http_status


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email, password=password)
            return Response({
                "id" : user.id,
                "email": user.email,
                "role": user.role
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def apply_leave(request):
    email = request.data.get('email')
    date = request.data.get('date')
    message = request.data.get('message')

    if not email or not date or not message:
        return Response({'error': 'Email, date and message are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    leave = LeaveRequest.objects.create(user=user, date=date, message=message)

    return Response({
        'email': user.email,
        'role': user.role,
        'date': leave.date,
        'message': leave.message,
        'status': leave.status
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def manage_leave(request):
    email = request.data.get('email')
    role = request.data.get('role')

    if not email or not role:
        return Response({'error': 'Email and role are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if role == 'user':
        leave_requests = LeaveRequest.objects.filter(user=user)
    elif role == 'manager':
        leave_requests = LeaveRequest.objects.all()
    else:
        return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)

    data = [{
        'id' : leave.id,
        'email': leave.user.email,
        'date': leave.date,
        'message': leave.message,
        'status': leave.status
    } for leave in leave_requests]

    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
def update_leave_status(request):
    leave_id = request.data.get('id')
    new_status = request.data.get('status')

    if not leave_id or not new_status:
        return Response({'error': 'Both id and status are required.'}, status=http_status.HTTP_400_BAD_REQUEST)

    try:
        leave = LeaveRequest.objects.get(id=leave_id)
        if new_status not in dict(LeaveRequest.STATUS_CHOICES):
            return Response({'error': 'Invalid status value.'}, status=http_status.HTTP_400_BAD_REQUEST)
        
        leave.status = new_status
        leave.save()

        return Response({'message': 'Leave status updated successfully.', 'status': leave.status}, status=http_status.HTTP_200_OK)
    
    except LeaveRequest.DoesNotExist:
        return Response({'error': 'Leave request not found.'}, status=http_status.HTTP_404_NOT_FOUND)
